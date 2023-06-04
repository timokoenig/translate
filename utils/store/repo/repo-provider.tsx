/* eslint-disable react-hooks/exhaustive-deps */
import * as GitHubCommits from '@/utils/github/commits'
import { TRANSLATION_FOLDER } from '@/utils/github/constants'
import * as GitHubContent from '@/utils/github/content'
import * as GitHubRepo from '@/utils/github/repo'
import languageJson from '@/utils/resources/languages.json'
import TranslationHelper from '@/utils/translation-helper'
import { useEffect, useState } from 'react'
import {
  Branch,
  Commit,
  Filter,
  Language,
  Repository,
  Translation,
  TranslationGroup,
} from '../../models'
import { composeTranslationGroups, deleteNestedValue, updateNestedValue } from './helper'
import { RepoStoreContext } from './repo-context'

const DEFAULT_BRANCH = {
  name: 'main',
  protected: false,
  commit: { sha: '', url: '' },
}

type Props = {
  repo: Repository
  children: JSX.Element | JSX.Element[]
}

const RepoStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false)
  const [currentRepo, setCurrentRepo] = useState<Repository>(props.repo)
  const [currentBranch, setCurrentBranch] = useState<Branch>(DEFAULT_BRANCH)
  const [translationGroups, setTranslationGroups] = useState<TranslationGroup[]>([])
  const [filter, setFilter] = useState<Filter>({
    category: null,
    language: null,
    missingTranslations: false,
  })

  // Load repository data including files, contributors, and branches
  const loadRepositoryData = async (repo?: Repository, branch?: Branch): Promise<void> => {
    const repository = repo ?? currentRepo
    const branches = await GitHubRepo.fetchBranches(repository)
    if (branches.length == 0) throw new Error('No branches available')

    const baseBranch =
      currentBranch.commit.sha == ''
        ? branches[0]
        : branches.find(obj => obj.name == (branch?.name ?? currentRepo.default_branch) ?? '')
    if (!baseBranch) throw new Error('Default branch not found')
    setCurrentBranch(baseBranch)

    const contributors = await GitHubRepo.fetchContributors(repository)

    const files = await GitHubContent.fetchTranslationFiles(repository, baseBranch)

    const categories = TranslationHelper.getCategories(files)

    const languages = TranslationHelper.getLanguages(files).map(obj => {
      const entry = languageJson.find(emoji => emoji.code == obj)
      if (entry) {
        return {
          code: entry.code.toLowerCase(),
          name: entry.name,
          emoji: entry.emoji ?? entry.code.toUpperCase(),
        }
      }
      return { code: obj, name: obj, emoji: '' }
    })

    setCurrentRepo({
      ...repository,
      branches,
      files,
      contributors,
      categories,
      languages,
    })

    setLoading(false)
  }

  // Set up new translation repository
  const setupRepository = async (lang: string): Promise<void> => {
    await GitHubContent.createOrUpdateTranslationFile(
      props.repo,
      { hello_world: 'Hello World' },
      lang,
      'common', // default category
      null,
      currentBranch
    )

    await loadRepositoryData()
  }

  // Reload repository data when user changes the current branch
  const changeCurrentBranch = async (branch: Branch): Promise<void> => {
    setIsLoadingContent(true)
    await loadRepositoryData(props.repo, branch)
    setIsLoadingContent(false)
  }

  // Add new translation to repository
  const addTranslation = async (
    translation: Translation,
    lang: string,
    category: string
  ): Promise<void> => {
    let translationFile = currentRepo.files.find(
      obj => obj.nameDisplay == category && obj.lang == lang
    )
    if (!translationFile) {
      translationFile = {
        name: `${category}.json`,
        nameDisplay: category,
        path: `${TRANSLATION_FOLDER}/${lang}/${category}.json`,
        data: {},
        sha: null,
        lang,
      }
    }

    const data = { ...translationFile.data }
    data[translation.key] = translation.value

    await GitHubContent.createOrUpdateTranslationFile(
      props.repo,
      data,
      lang,
      category,
      translationFile.sha,
      currentBranch
    )

    await loadRepositoryData()
  }

  // Update existing translation group
  const updateTranslationGroup = async (
    oldTranslationGroup: TranslationGroup,
    newTranslationGroup: TranslationGroup
  ): Promise<void> => {
    if (JSON.stringify(oldTranslationGroup) == JSON.stringify(newTranslationGroup)) return

    await Promise.all(
      currentRepo.languages.map(async (lang: Language): Promise<void> => {
        let translationFile = currentRepo.files.find(
          obj => obj.nameDisplay == newTranslationGroup.category && obj.lang == lang.code
        )
        if (!translationFile) {
          translationFile = {
            name: `${newTranslationGroup.category}.json`,
            nameDisplay: newTranslationGroup.category,
            path: `${TRANSLATION_FOLDER}/${lang.code}/${newTranslationGroup.category}.json`,
            data: {},
            sha: null,
            lang: lang.code,
          }
        }

        let data = { ...translationFile.data }

        if (oldTranslationGroup.key != newTranslationGroup.key) {
          // Key has changed, first delete old key and then add new one
          data = deleteNestedValue(oldTranslationGroup.keyPath, {
            ...translationFile.data,
          })
        }

        data = updateNestedValue(newTranslationGroup, lang.code, newTranslationGroup.keyPath, data)

        await GitHubContent.createOrUpdateTranslationFile(
          props.repo,
          data,
          lang.code,
          translationFile.nameDisplay,
          translationFile.sha,
          currentBranch
        )
      })
    )

    await loadRepositoryData()
  }

  // Delete translation group
  const deleteTranslationGroup = async (translationGroup: TranslationGroup): Promise<void> => {
    await Promise.all(
      translationGroup.translations.map(async translation => {
        let translationFile = currentRepo.files.find(
          obj => obj.nameDisplay == translationGroup.category && obj.lang == translation.lang
        )
        if (!translationFile) {
          translationFile = {
            name: `${translationGroup.category}.json`,
            nameDisplay: translationGroup.category,
            path: `${TRANSLATION_FOLDER}/${translation.lang}/${translationGroup.category}.json`,
            data: {},
            sha: null,
            lang: translation.lang,
          }
        }

        const data = deleteNestedValue(translationGroup.keyPath, { ...translationFile.data })

        if (JSON.stringify({ ...translationFile.data }) == JSON.stringify(data)) {
          // Key does not exist, skip update
          return
        }

        await GitHubContent.createOrUpdateTranslationFile(
          props.repo,
          data,
          translation.lang,
          translationFile.nameDisplay,
          translationFile.sha,
          currentBranch
        )
      })
    )

    await loadRepositoryData()
  }

  const fetchHistory = (): Promise<Commit[]> =>
    GitHubCommits.fetchHistory(currentRepo, currentBranch)

  const addCategory = async (category: string): Promise<void> => {
    await GitHubContent.addCategory(currentRepo, currentBranch, category)
    await loadRepositoryData()
  }

  const updateCategory = async (oldCategory: string, newCategory: string): Promise<void> => {
    await GitHubContent.updateCategory(currentRepo, currentBranch, oldCategory, newCategory)
    await loadRepositoryData()
  }

  const deleteCategory = async (category: string): Promise<void> => {
    await GitHubContent.deleteCategory(currentRepo, currentBranch, category)
    await loadRepositoryData()
  }

  const addLanguage = async (language: Language): Promise<void> => {
    await GitHubContent.addLanguage(currentRepo, currentBranch, language)
    await loadRepositoryData()
  }

  const deleteLanguage = async (language: Language): Promise<void> => {
    await GitHubContent.deleteLanguage(currentRepo, currentBranch, language)
    await loadRepositoryData()
  }

  // Reload repository data when user changes the repo
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setFilter({ category: null, language: null, missingTranslations: false })
      await loadRepositoryData(props.repo)
    })()
  }, [props.repo])

  // Compose translation groups every time the current repo changes
  useEffect(() => {
    const groups = composeTranslationGroups(currentRepo)
    setTranslationGroups(groups)
  }, [currentRepo])

  return (
    <RepoStoreContext.Provider
      value={{
        isLoading,
        isLoadingContent,
        filter,
        setFilter,
        currentRepo,
        currentBranch,
        changeCurrentBranch,
        setupRepository,
        translationGroups,
        addTranslation,
        updateTranslationGroup,
        deleteTranslationGroup,
        fetchHistory,
        addCategory,
        updateCategory,
        deleteCategory,
        addLanguage,
        deleteLanguage,
      }}
    >
      {props.children}
    </RepoStoreContext.Provider>
  )
}

export default RepoStoreProvider

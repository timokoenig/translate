/* eslint-disable react-hooks/exhaustive-deps */
import languages from '@/utils/resources/languages.json'
import TranslationHelper from '@/utils/translation-helper'
import moment from 'moment'
import { getSession } from 'next-auth/react'
import { Octokit } from 'octokit'
import { useEffect, useState } from 'react'
import {
  Commit,
  Filter,
  Language,
  Repository,
  Translation,
  TranslationFile,
  TranslationFileData,
  TranslationGroup,
  User,
} from '../../models'
import { RepoStoreContext } from './repo-context'

const TRANSLATION_FOLDER = 'translations'
const GITHUB_API_VERSION = '2022-11-28'

type Props = {
  repo: Repository
  children: JSX.Element | JSX.Element[]
}

const RepoStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [translationFiles, setTranslationFiles] = useState<TranslationFile[] | null>(null)
  const [contributors, setContributors] = useState<User[]>([])
  const [filter, setFilter] = useState<Filter>({
    category: null,
    language: null,
    missingTranslations: false,
  })

  // Fetch all repository contributors
  const fetchRepositoryContributors = async (): Promise<void> => {
    const session = await getSession()
    if (!session) throw new Error('Invalid session')

    const octokit = new Octokit({ auth: session.accessToken })
    const res: { data: User[] } = await octokit.rest.repos.listContributors({
      owner: props.repo.owner.login,
      repo: props.repo.name,
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    })
    setContributors(res.data)
  }

  // Fetch repository translation files
  const fetchRepositoryTranslationFiles = async (): Promise<void> => {
    const session = await getSession()
    if (!session) throw new Error('Invalid session')

    const octokit = new Octokit({ auth: session.accessToken })

    try {
      // First get all language folders in the translation folder
      const repoContent: { data: { name: string }[] } = await octokit.request(
        `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FOLDER}`,
        {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          headers: {
            'X-GitHub-Api-Version': GITHUB_API_VERSION,
          },
        }
      )
      const repoLanguages = repoContent.data.map(obj => obj.name)

      // Then get the translation files from the language folder
      const files = await Promise.all(
        repoLanguages.map(async lang => {
          const res: { data: { name: string }[] } = await octokit.request(
            `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FOLDER}/${lang}`,
            {
              owner: props.repo.owner.login,
              repo: props.repo.name,
              headers: {
                'X-GitHub-Api-Version': GITHUB_API_VERSION,
              },
            }
          )

          // Then get the translation file content
          return await Promise.all(
            res.data.map(async file => {
              const res = await octokit.request(
                `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FOLDER}/${lang}/${file.name}`,
                {
                  owner: props.repo.owner.login,
                  repo: props.repo.name,
                  headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION,
                  },
                }
              )
              return {
                name: res.data.name,
                nameDisplay: res.data.name.replace('.json', ''),
                path: res.data.path,
                data: JSON.parse(Buffer.from(res.data.content, 'base64').toString()),
                sha: res.data.sha,
                lang,
              }
            })
          )
        })
      )

      setTranslationFiles(files.flat())
    } catch (err: unknown) {
      if (`${err}`.includes('Not Found')) {
        // the translation files do not exist yet; allow the user to create a new one
        return
      }
      throw err
    }
  }

  // Create or Update repository translation file
  const createOrUpdateRepositoryTranslationFile = async (
    data: any,
    lang: string,
    category: string,
    sha: string | null
  ): Promise<void> => {
    const session = await getSession()
    if (!session) throw new Error('Invalid session')

    const octokit = new Octokit({ auth: session.accessToken })
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: props.repo.owner.login,
      repo: props.repo.name,
      path: `${TRANSLATION_FOLDER}/${lang}/${category}.json`,
      sha: sha ?? undefined,
      message: sha
        ? `[Translate] Update translation for ${lang}/${category}`
        : `[Translate] Create translation for ${lang}/${category}`,
      content: Buffer.from(JSON.stringify(data)).toString('base64'),
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    })
  }

  // Set up new translation repo
  const setupRepository = async (lang: string): Promise<void> => {
    await createOrUpdateRepositoryTranslationFile(
      { hello_world: 'Hello World' },
      lang,
      'common', // default category
      null
    )
    await fetchRepositoryTranslationFiles()
  }

  // Add new translation
  const addTranslation = async (
    translation: Translation,
    lang: string,
    category: string
  ): Promise<void> => {
    if (!translationFiles) throw new Error('No translation files')

    let translationFile = translationFiles.find(
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

    await createOrUpdateRepositoryTranslationFile(data, lang, category, translationFile.sha)
    await fetchRepositoryTranslationFiles()
  }

  // Update existing translation group
  const updateTranslationGroup = async (
    oldTranslationGroup: TranslationGroup,
    newTranslationGroup: TranslationGroup
  ): Promise<void> => {
    if (!translationFiles) throw new Error('No translation files')

    await Promise.all(
      newTranslationGroup.translations.map(async translation => {
        let translationFile = translationFiles.find(
          obj => obj.nameDisplay == newTranslationGroup.category && obj.lang == translation.lang
        )
        if (!translationFile) {
          translationFile = {
            name: `${newTranslationGroup.category}.json`,
            nameDisplay: newTranslationGroup.category,
            path: `${TRANSLATION_FOLDER}/${translation.lang}/${newTranslationGroup.category}.json`,
            data: {},
            sha: null,
            lang: translation.lang,
          }
        }

        const data = { ...translationFile.data }
        let dataDidChange = false

        if (oldTranslationGroup.key != newTranslationGroup.key) {
          // Key has changed, first delete old key and then add new one
          delete data[oldTranslationGroup.key]
          dataDidChange = true
        }
        if (data[newTranslationGroup.key] != translation.value) {
          data[newTranslationGroup.key] = translation.value
          dataDidChange = true
        }

        if (!dataDidChange) {
          // Nothing changed, skip update
          return
        }

        await createOrUpdateRepositoryTranslationFile(
          data,
          translation.lang,
          translationFile.nameDisplay,
          translationFile.sha
        )
      })
    )

    await fetchRepositoryTranslationFiles()
  }

  // Delete translation group
  const deleteTranslationGroup = async (translationGroup: TranslationGroup): Promise<void> => {
    if (!translationFiles) throw new Error('No translation files')

    await Promise.all(
      translationGroup.translations.map(async translation => {
        let translationFile = translationFiles.find(
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

        const data = { ...translationFile.data }

        if (!Object.keys(data).includes(translationGroup.key)) {
          // Key does not exist, skip update
          return
        }

        delete data[translationGroup.key]

        await createOrUpdateRepositoryTranslationFile(
          data,
          translation.lang,
          translationFile.nameDisplay,
          translationFile.sha
        )
      })
    )

    await fetchRepositoryTranslationFiles()
  }

  const fetchHistory = async (): Promise<Commit[]> => {
    const session = await getSession()
    if (!session) throw new Error('Invalid session')

    const octokit = new Octokit({ auth: session.accessToken })
    const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner: props.repo.owner.login,
      repo: props.repo.name,
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    })
    const commits = res.data
      .map(obj => ({
        sha: obj.sha,
        message: obj.commit.message,
        patch: '',
        author: {
          name: obj.commit.author?.name ?? '',
          email: obj.commit.author?.email ?? '',
          date: moment(obj.commit.author?.date ?? ''),
          avatar_url: obj.author?.avatar_url ?? '',
        },
        committer: {
          name: obj.commit.committer?.name ?? '',
          email: obj.commit.committer?.email ?? '',
          date: moment(obj.commit.committer?.date ?? ''),
          avatar_url: obj.committer?.avatar_url ?? '',
        },
      }))
      .filter(obj => obj.message.includes('[Translate]'))

    return await Promise.all(
      commits.map(async obj => {
        if (
          obj.message.includes('Create translation') ||
          obj.message.includes('Update translation')
        ) {
          // Only get the patch for translation udpates
          const patch = await fetchPatchForCommit(obj)
          return { ...obj, patch }
        }
        return obj
      })
    )
  }

  const fetchPatchForCommit = async (commit: Commit): Promise<string> => {
    const session = await getSession()
    if (!session) throw new Error('Invalid session')

    const octokit = new Octokit({ auth: session.accessToken })
    const res = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner: props.repo.owner.login,
      repo: props.repo.name,
      ref: commit.sha,
      headers: {
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    })
    if (!res.data.files || (res.data.files?.length ?? 0) == 0) {
      return ''
    }
    return res.data.files[0].patch ?? ''
  }

  const getCategories = (): string[] => TranslationHelper.getCategories(translationFiles ?? [])

  const addCategory = async (category: string): Promise<void> => {
    await Promise.all(
      getLanguages().map(async lang => {
        const session = await getSession()
        if (!session) throw new Error('Invalid session')

        const octokit = new Octokit({ auth: session.accessToken })
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          path: `${TRANSLATION_FOLDER}/${lang.code}/${category}.json`,
          message: `[Translate] Create category ${lang.code}/${category}`,
          content: Buffer.from(JSON.stringify({})).toString('base64'),
          headers: {
            'X-GitHub-Api-Version': GITHUB_API_VERSION,
          },
        })
      })
    )

    await fetchRepositoryTranslationFiles()
  }

  const updateCategory = async (oldCategory: string, newCategory: string): Promise<void> => {
    await Promise.all(
      getLanguages().map(async lang => {
        const session = await getSession()
        if (!session) throw new Error('Invalid session')

        const octokit = new Octokit({ auth: session.accessToken })

        const translationFile = translationFiles?.find(
          obj => obj.lang == lang.code && obj.nameDisplay == oldCategory
        )
        if (!translationFile || !translationFile.sha) return

        // First create the new category
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          path: `${TRANSLATION_FOLDER}/${lang.code}/${newCategory}.json`,
          message: `[Translate] Create category ${lang.code}/${newCategory}`,
          content: Buffer.from(JSON.stringify(translationFile.data)).toString('base64'),
          headers: {
            'X-GitHub-Api-Version': GITHUB_API_VERSION,
          },
        })

        // Then delete the old category
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          path: `${TRANSLATION_FOLDER}/${lang.code}/${oldCategory}.json`,
          message: `[Translate] Delete category ${lang.code}/${oldCategory}`,
          sha: translationFile.sha,
          headers: {
            'X-GitHub-Api-Version': GITHUB_API_VERSION,
          },
        })
      })
    )

    await fetchRepositoryTranslationFiles()
  }

  const deleteCategory = async (category: string): Promise<void> => {
    await Promise.all(
      getLanguages().map(async lang => {
        const session = await getSession()
        if (!session) throw new Error('Invalid session')

        const translationFile = translationFiles?.find(
          obj => obj.lang == lang.code && obj.nameDisplay == category
        )
        if (!translationFile || !translationFile.sha) return

        const octokit = new Octokit({ auth: session.accessToken })
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          path: `${TRANSLATION_FOLDER}/${lang.code}/${category}.json`,
          message: `[Translate] Delete category ${lang.code}/${category}`,
          sha: translationFile.sha,
          headers: {
            'X-GitHub-Api-Version': GITHUB_API_VERSION,
          },
        })
      })
    )

    await fetchRepositoryTranslationFiles()
  }

  const getLanguages = (): Language[] =>
    TranslationHelper.getLanguages(translationFiles ?? []).map(obj => {
      const entry = languages.find(emoji => emoji.code == obj)
      if (entry) {
        return {
          code: entry.code.toLowerCase(),
          name: entry.name,
          emoji: entry.emoji ?? entry.code.toUpperCase(),
        }
      }
      return { code: obj, name: obj, emoji: '' }
    })

  const addLanguage = async (language: Language): Promise<void> => {
    await Promise.all(
      getCategories().map(async category => {
        const session = await getSession()
        if (!session) throw new Error('Invalid session')

        const octokit = new Octokit({ auth: session.accessToken })
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          path: `${TRANSLATION_FOLDER}/${language.code}/${category}.json`,
          message: `[Translate] Add language ${language.code}/${category}`,
          content: Buffer.from(JSON.stringify({})).toString('base64'),
          headers: {
            'X-GitHub-Api-Version': GITHUB_API_VERSION,
          },
        })
      })
    )

    await fetchRepositoryTranslationFiles()
  }

  const deleteLanguage = async (language: Language): Promise<void> => {
    await Promise.all(
      getCategories().map(async category => {
        const session = await getSession()
        if (!session) throw new Error('Invalid session')

        const translationFile = translationFiles?.find(
          obj => obj.lang == language.code && obj.nameDisplay == category
        )
        if (!translationFile || !translationFile.sha) return

        const octokit = new Octokit({ auth: session.accessToken })
        await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          path: `${TRANSLATION_FOLDER}/${language.code}/${category}.json`,
          message: `[Translate] Delete language ${language.code}/${category}`,
          sha: translationFile.sha,
          headers: {
            'X-GitHub-Api-Version': GITHUB_API_VERSION,
          },
        })
      })
    )

    await fetchRepositoryTranslationFiles()
  }

  const getTranslationGroups = (): TranslationGroup[] => {
    let translationGroups: TranslationGroup[] = []
    let availableLanguages = getLanguages()

    const mapTranslationGroup = (
      file: TranslationFile,
      data: TranslationFileData,
      groups: TranslationGroup[],
      keyPath: string[]
    ): TranslationGroup[] => {
      let tmpGroups = groups

      Object.keys(data).forEach(key => {
        const keyData = data[key] as string | TranslationFileData

        let group = tmpGroups.find(obj => obj.key == key)
        if (!group) {
          group = {
            category: file.nameDisplay,
            key,
            keyPath: [...keyPath, key],
            translations: availableLanguages.map(lang => ({
              key,
              value: '',
              lang: lang.code,
            })),
            children: [],
          }
        }

        if (typeof keyData == 'string') {
          group.translations = [
            ...group.translations.filter(obj => obj.lang != file.lang),
            {
              key,
              value: keyData,
              lang: file.lang,
            },
          ]
        } else if (typeof keyData == 'object') {
          group.children = mapTranslationGroup(file, keyData, group.children, group.keyPath)
        }

        tmpGroups = [...tmpGroups.filter(obj => obj.key != group?.key), group]
      })

      return tmpGroups.sort((a, b) =>
        a.key.toLowerCase() > b.key.toLowerCase()
          ? 1
          : a.key.toLowerCase() < b.key.toLowerCase()
          ? -1
          : 0
      )
    }

    translationFiles?.forEach(file => {
      translationGroups = mapTranslationGroup(file, file.data, translationGroups, [])
    })

    return translationGroups
  }

  // Load repository data
  const loadRepoData = async () => {
    await fetchRepositoryContributors()
    await fetchRepositoryTranslationFiles()
  }
  useEffect(() => {
    ;(async () => {
      await loadRepoData()
      setLoading(false)
    })()
  }, [])

  // Reload repository data when user changes the repo
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setContributors([])
      setTranslationFiles(null)
      setFilter({ category: null, language: null, missingTranslations: false })
      await loadRepoData()
      setLoading(false)
    })()
  }, [props.repo])

  return (
    <RepoStoreContext.Provider
      value={{
        isLoading,
        filter,
        setFilter,
        contributors,
        translationFiles,
        setupRepository,
        addTranslation,
        updateTranslationGroup,
        deleteTranslationGroup,
        fetchHistory,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getLanguages,
        addLanguage,
        deleteLanguage,
        getTranslationGroups,
      }}
    >
      {props.children}
    </RepoStoreContext.Provider>
  )
}

export default RepoStoreProvider

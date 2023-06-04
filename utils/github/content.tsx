import { getSession } from 'next-auth/react'
import { Octokit } from 'octokit'
import { Branch, Language, Repository, TranslationFile } from '../models'
import { GITHUB_API_VERSION, TRANSLATION_FOLDER } from './constants'

// Fetch repository translation files
export const fetchTranslationFiles = async (
  repo: Repository,
  currentBranch: Branch
): Promise<TranslationFile[]> => {
  const session = await getSession()
  if (!session) throw new Error('Invalid session')

  const octokit = new Octokit({ auth: session.accessToken })

  try {
    // First get all language folders in the translation folder
    const repoContent: { data: { name: string }[] } = await octokit.request(
      `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FOLDER}`,
      {
        owner: repo.owner.login,
        repo: repo.name,
        ref: currentBranch.name,
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
            owner: repo.owner.login,
            repo: repo.name,
            ref: currentBranch.name,
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
                owner: repo.owner.login,
                repo: repo.name,
                ref: currentBranch.name,
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

    return files.flat()
  } catch (err: unknown) {
    if (`${err}`.includes('Not Found')) {
      // the translation files do not exist yet; allow the user to create a new one
      return []
    }
    throw err
  }
}

// Create or Update repository translation file
export const createOrUpdateTranslationFile = async (
  repo: Repository,
  data: any,
  lang: string,
  category: string,
  sha: string | null,
  currentBranch: Branch
): Promise<void> => {
  const session = await getSession()
  if (!session) throw new Error('Invalid session')

  const octokit = new Octokit({ auth: session.accessToken })
  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: repo.owner.login,
    repo: repo.name,
    path: `${TRANSLATION_FOLDER}/${lang}/${category}.json`,
    sha: sha ?? undefined,
    branch: currentBranch.name,
    message: sha
      ? `[Translate] Update translation for ${lang}/${category}`
      : `[Translate] Create translation for ${lang}/${category}`,
    content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
    headers: {
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
    },
  })
}

export const addCategory = async (
  repo: Repository,
  currentBranch: Branch,
  category: string
): Promise<void> => {
  await Promise.all(
    repo.languages.map(async lang => {
      const session = await getSession()
      if (!session) throw new Error('Invalid session')

      const octokit = new Octokit({ auth: session.accessToken })
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.login,
        repo: repo.name,
        path: `${TRANSLATION_FOLDER}/${lang.code}/${category}.json`,
        message: `[Translate] Create category ${lang.code}/${category}`,
        content: Buffer.from(JSON.stringify({})).toString('base64'),
        branch: currentBranch.name,
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })
    })
  )
}

export const updateCategory = async (
  repo: Repository,
  currentBranch: Branch,
  oldCategory: string,
  newCategory: string
): Promise<void> => {
  await Promise.all(
    repo.languages.map(async lang => {
      const session = await getSession()
      if (!session) throw new Error('Invalid session')

      const octokit = new Octokit({ auth: session.accessToken })

      const translationFile = repo.files.find(
        obj => obj.lang == lang.code && obj.nameDisplay == oldCategory
      )
      if (!translationFile || !translationFile.sha) return

      // First create the new category
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.login,
        repo: repo.name,
        path: `${TRANSLATION_FOLDER}/${lang.code}/${newCategory}.json`,
        message: `[Translate] Create category ${lang.code}/${newCategory}`,
        content: Buffer.from(JSON.stringify(translationFile.data)).toString('base64'),
        branch: currentBranch.name,
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })

      // Then delete the old category
      await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.login,
        repo: repo.name,
        path: `${TRANSLATION_FOLDER}/${lang.code}/${oldCategory}.json`,
        message: `[Translate] Delete category ${lang.code}/${oldCategory}`,
        sha: translationFile.sha,
        branch: currentBranch.name,
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })
    })
  )
}

export const deleteCategory = async (
  repo: Repository,
  currentBranch: Branch,
  category: string
): Promise<void> => {
  await Promise.all(
    repo.languages.map(async lang => {
      const session = await getSession()
      if (!session) throw new Error('Invalid session')

      const translationFile = repo.files.find(
        obj => obj.lang == lang.code && obj.nameDisplay == category
      )
      if (!translationFile || !translationFile.sha) return

      const octokit = new Octokit({ auth: session.accessToken })
      await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.login,
        repo: repo.name,
        path: `${TRANSLATION_FOLDER}/${lang.code}/${category}.json`,
        message: `[Translate] Delete category ${lang.code}/${category}`,
        sha: translationFile.sha,
        branch: currentBranch.name,
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })
    })
  )
}

export const addLanguage = async (
  repo: Repository,
  currentBranch: Branch,
  language: Language
): Promise<void> => {
  await Promise.all(
    repo.categories.map(async category => {
      const session = await getSession()
      if (!session) throw new Error('Invalid session')

      const octokit = new Octokit({ auth: session.accessToken })
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.login,
        repo: repo.name,
        path: `${TRANSLATION_FOLDER}/${language.code}/${category}.json`,
        message: `[Translate] Add language ${language.code}/${category}`,
        content: Buffer.from(JSON.stringify({})).toString('base64'),
        branch: currentBranch.name,
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })
    })
  )
}

export const deleteLanguage = async (
  repo: Repository,
  currentBranch: Branch,
  language: Language
): Promise<void> => {
  await Promise.all(
    repo.categories.map(async category => {
      const session = await getSession()
      if (!session) throw new Error('Invalid session')

      const translationFile = repo.files.find(
        obj => obj.lang == language.code && obj.nameDisplay == category
      )
      if (!translationFile || !translationFile.sha) return

      const octokit = new Octokit({ auth: session.accessToken })
      await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: repo.owner.login,
        repo: repo.name,
        path: `${TRANSLATION_FOLDER}/${language.code}/${category}.json`,
        message: `[Translate] Delete language ${language.code}/${category}`,
        sha: translationFile.sha,
        branch: currentBranch.name,
        headers: {
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
        },
      })
    })
  )
}

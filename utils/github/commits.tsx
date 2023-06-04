import moment from 'moment'
import { getSession } from 'next-auth/react'
import { Octokit } from 'octokit'
import { Branch, Commit, Repository } from '../models'
import { GITHUB_API_VERSION } from './constants'

const fetchPatchForCommit = async (repo: Repository, commit: Commit): Promise<string> => {
  const session = await getSession()
  if (!session) throw new Error('Invalid session')

  const octokit = new Octokit({ auth: session.accessToken })
  const res = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
    owner: repo.owner.login,
    repo: repo.name,
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

export const fetchHistory = async (repo: Repository, currentBranch: Branch): Promise<Commit[]> => {
  const session = await getSession()
  if (!session) throw new Error('Invalid session')

  const octokit = new Octokit({ auth: session.accessToken })
  const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: repo.owner.login,
    repo: repo.name,
    sha: currentBranch.name,
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
        const patch = await fetchPatchForCommit(repo, obj)
        return { ...obj, patch }
      }
      return obj
    })
  )
}

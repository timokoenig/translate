import { getSession } from 'next-auth/react'
import { Octokit } from 'octokit'
import { Branch, Repository, User } from '../models'
import { GITHUB_API_VERSION } from './constants'

// Fetch all github repositories from the current authenticated user
export const fetchRepositories = async (): Promise<Repository[]> => {
  const session = await getSession()
  if (!session) throw new Error('Invalid session')

  const octokit = new Octokit({ auth: session.accessToken })
  const res = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser as any, {
    per_page: 100,
  })
  return res.map((obj: any) => ({
    ...obj,
    contributors: [],
    files: [],
    languages: [],
    categories: [],
    branches: [],
  }))
}

// Fetch all repository contributors
export const fetchContributors = async (repo: Repository): Promise<User[]> => {
  const session = await getSession()
  if (!session) throw new Error('Invalid session')

  const octokit = new Octokit({ auth: session.accessToken })
  const res: { data: User[] } = await octokit.rest.repos.listContributors({
    owner: repo.owner.login,
    repo: repo.name,
    headers: {
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
    },
  })
  return res.data
}

// Fetch all repository branches
export const fetchBranches = async (repo: Repository): Promise<Branch[]> => {
  const session = await getSession()
  if (!session) throw new Error('Invalid session')

  const octokit = new Octokit({ auth: session.accessToken })
  const res: { data: Branch[] } = await octokit.request('GET /repos/{owner}/{repo}/branches', {
    owner: repo.owner.login,
    repo: repo.name,
    headers: {
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
    },
  })
  return res.data
}

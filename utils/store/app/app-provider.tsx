/* eslint-disable react-hooks/exhaustive-deps */
import { getSession } from 'next-auth/react'
import { Octokit } from 'octokit'
import { useEffect, useState } from 'react'
import { Repository } from '../../models'
import { AppStoreContext } from './app-context'

const LOCAL_STORAGE_KEY_REPOSITORIES = 'local-repos'

type Props = {
  children: JSX.Element | JSX.Element[]
}

const AppStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
  const [localRepositories, setLocalRepositories] = useState<Repository[]>([])
  const [remoteRepositories, setRemoteRepositories] = useState<Repository[]>([])

  // Get the local repositories from local storage and set it in the app store state
  const getLocalRepositories = (remoteRepos: Repository[]): void => {
    const localRepoIDs = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY_REPOSITORIES) ?? '[]'
    ) as number[]
    setLocalRepositories(remoteRepos.filter(obj => localRepoIDs.includes(obj.id)))
  }
  // save the repositories to the local storage
  const saveLocalRepositories = (repos: Repository[]): void => {
    const repoIDs = repos.map(obj => obj.id)
    localStorage.setItem(LOCAL_STORAGE_KEY_REPOSITORIES, JSON.stringify(repoIDs))
  }
  // Set the given repositories in the app store state and save it to local storage
  const setRepositories = (repos: Repository[]): void => {
    setLocalRepositories(repos)
    saveLocalRepositories(repos)
  }

  // Fetch all github repositories from the current authenticated user
  const fetchGithubRepositories = async (): Promise<Repository[]> => {
    const session = await getSession()
    if (!session) throw new Error('Invalid session')

    const octokit = new Octokit({ auth: session.accessToken })
    const res = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
      per_page: 100,
    })
    return res
  }
  const getRemoteRepositories = async (): Promise<Repository[]> => {
    const res = await fetchGithubRepositories()
    setRemoteRepositories(res)
    return res
  }

  // Load the initial app data
  useEffect(() => {
    if (!isAuthenticated) return
    ;(async () => {
      const repos = await getRemoteRepositories()
      getLocalRepositories(repos)
      setLoading(false)
    })()
  }, [isAuthenticated])

  // Check if user is authenticated
  useEffect(() => {
    ;(async () => {
      const session = await getSession()
      if (session) {
        setAuthenticated(true)
      }
    })()
  })

  return (
    <AppStoreContext.Provider
      value={{
        isLoading,
        mobileMenuOpen,
        setMobileMenuOpen,
        localRepositories,
        setLocalRepositories: setRepositories,
        remoteRepositories,
        fetchGithubRepositories,
        setAuthenticated,
      }}
    >
      {props.children}
    </AppStoreContext.Provider>
  )
}

export default AppStoreProvider

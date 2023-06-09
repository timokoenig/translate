import { createContext, useContext } from 'react'
import { Repository } from '../../models'

type AppStoreContextType = {
  isLoading: boolean

  mobileMenuOpen: boolean
  setMobileMenuOpen: (value: boolean) => void

  localRepositories: Repository[]
  setLocalRepositories: (repo: Repository[]) => void

  remoteRepositories: Repository[]

  setAuthenticated: (value: boolean) => void
}

export const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined)

export const useAppStore = (): AppStoreContextType => {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('Invalid context')
  return ctx
}

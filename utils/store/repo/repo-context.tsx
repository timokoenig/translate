import { createContext, useContext } from 'react'
import {
  Branch,
  Commit,
  Filter,
  Language,
  Repository,
  Translation,
  TranslationGroup,
} from '../../models'

type RepoStoreContextType = {
  isLoading: boolean
  isLoadingContent: boolean

  filter: Filter
  setFilter: (filter: Filter) => void

  currentRepo: Repository

  currentBranch: Branch
  changeCurrentBranch: (branch: Branch) => Promise<void>

  setupRepository: (lang: string) => Promise<void>

  translationGroups: TranslationGroup[]
  addTranslation: (translation: Translation, lang: string, category: string) => Promise<void>
  updateTranslationGroup: (
    oldTranslationGropu: TranslationGroup,
    newTranslationGroup: TranslationGroup
  ) => Promise<void>
  deleteTranslationGroup: (translationGroup: TranslationGroup) => Promise<void>

  fetchHistory: () => Promise<Commit[]>

  addCategory: (category: string) => Promise<void>
  updateCategory: (oldCategory: string, newCategory: string) => Promise<void>
  deleteCategory: (category: string) => Promise<void>

  addLanguage: (language: Language) => Promise<void>
  deleteLanguage: (language: Language) => Promise<void>
}

export const RepoStoreContext = createContext<RepoStoreContextType | undefined>(undefined)

export const useRepoStore = (): RepoStoreContextType => {
  const ctx = useContext(RepoStoreContext)
  if (!ctx) throw new Error('Invalid context')
  return ctx
}

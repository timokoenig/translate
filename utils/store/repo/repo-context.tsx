import { createContext, useContext } from 'react'
import {
  Commit,
  Filter,
  Language,
  Translation,
  TranslationFile,
  TranslationGroup,
  User,
} from '../../models'

type RepoStoreContextType = {
  isLoading: boolean

  filter: Filter
  setFilter: (filter: Filter) => void

  contributors: User[]

  translationFiles: TranslationFile[] | null

  setupRepository: (lang: string) => Promise<void>

  addTranslation: (translation: Translation, lang: string, category: string) => Promise<void>
  updateTranslationGroup: (
    oldTranslationGropu: TranslationGroup,
    newTranslationGroup: TranslationGroup
  ) => Promise<void>
  deleteTranslationGroup: (translationGroup: TranslationGroup) => Promise<void>

  fetchHistory: () => Promise<Commit[]>

  getCategories: () => string[]
  addCategory: (category: string) => Promise<void>
  updateCategory: (oldCategory: string, newCategory: string) => Promise<void>
  deleteCategory: (category: string) => Promise<void>

  getLanguages: () => Language[]
  addLanguage: (language: Language) => Promise<void>
  deleteLanguage: (language: Language) => Promise<void>

  getTranslationGroups: () => TranslationGroup[]
}

export const RepoStoreContext = createContext<RepoStoreContextType | undefined>(undefined)

export const useRepoStore = (): RepoStoreContextType => {
  const ctx = useContext(RepoStoreContext)
  if (!ctx) throw new Error('Invalid context')
  return ctx
}

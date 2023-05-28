import { createContext, useContext } from 'react'
import { TranslationGroup } from '../../models'

type TranslationStoreContextType = {
  isLoading: boolean
  setLoading: (isLoading: boolean) => void

  selectedTranslationGroup: TranslationGroup | null
  setSelectedTranslationGroup: (translationGroup: TranslationGroup | null) => void
}

export const TranslationStoreContext = createContext<TranslationStoreContextType | undefined>(
  undefined
)

export const useTranslationStore = (): TranslationStoreContextType => {
  const ctx = useContext(TranslationStoreContext)
  if (!ctx) throw new Error('Invalid context')
  return ctx
}

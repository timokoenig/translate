import { createContext, useContext } from 'react'

type SettingsStoreContextType = {
  hasTranslationApiKey: () => boolean
  getTranslationApiKey: () => string | null
  setTranslationApiKey: (value: string | null) => void
}

export const SettingsStoreContext = createContext<SettingsStoreContextType | undefined>(undefined)

export const useSettingsStore = (): SettingsStoreContextType => {
  const ctx = useContext(SettingsStoreContext)
  if (!ctx) throw new Error('Invalid context')
  return ctx
}

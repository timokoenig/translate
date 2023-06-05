import secureLocalStorage from 'react-secure-storage'
import { SettingsStoreContext } from './settings-context'

const LOCAL_STORAGE_KEY_TRANSLATION_API_KEY = 'local-repos'

type Props = {
  children: JSX.Element | JSX.Element[]
}

const SettingsStoreProvider = (props: Props): JSX.Element => {
  // Returns true when translation API key is available
  const hasTranslationApiKey = (): boolean =>
    secureLocalStorage.getItem(LOCAL_STORAGE_KEY_TRANSLATION_API_KEY) !== null

  // Get the Google Translate API key from secure storage
  const getTranslationApiKey = (): string | null =>
    secureLocalStorage.getItem(LOCAL_STORAGE_KEY_TRANSLATION_API_KEY) as string | null

  // Save the Google Translate API key to secure storage
  const setTranslationApiKey = (value: string | null): void => {
    if (value) {
      secureLocalStorage.setItem(LOCAL_STORAGE_KEY_TRANSLATION_API_KEY, value)
    } else {
      secureLocalStorage.removeItem(LOCAL_STORAGE_KEY_TRANSLATION_API_KEY)
    }
  }

  return (
    <SettingsStoreContext.Provider
      value={{
        hasTranslationApiKey,
        getTranslationApiKey,
        setTranslationApiKey,
      }}
    >
      {props.children}
    </SettingsStoreContext.Provider>
  )
}

export default SettingsStoreProvider

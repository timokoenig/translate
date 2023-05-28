import { useState } from 'react'
import { TranslationGroup } from '../../models'
import { TranslationStoreContext } from './translation-context'

type Props = {
  children: JSX.Element | JSX.Element[]
}

const TranslationStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [selectedTranslationGroup, setSelectedTranslationGroup] = useState<TranslationGroup | null>(
    null
  )

  return (
    <TranslationStoreContext.Provider
      value={{
        isLoading,
        setLoading,
        selectedTranslationGroup,
        setSelectedTranslationGroup,
      }}
    >
      {props.children}
    </TranslationStoreContext.Provider>
  )
}

export default TranslationStoreProvider

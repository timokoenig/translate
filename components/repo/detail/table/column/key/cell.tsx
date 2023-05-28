import { TranslationGroup } from '@/utils/models'
import { useTranslationStore } from '@/utils/store/translation/translation-context'
import { Input, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import ColumnKeyContainer from './container'

// Get the count of all visible translations
const getCount = (group: TranslationGroup): number => {
  if (group.children.length == 0) {
    return 1
  }
  return group.children.map(getCount).reduce((a, b) => a + b, 0)
}

type Props = {
  data: CellContext<TranslationGroup, unknown>
}

const ColumnKeyCell = (props: Props) => {
  const translationGroup = props.data.getValue() as TranslationGroup
  const { selectedTranslationGroup, setSelectedTranslationGroup } = useTranslationStore()
  const translationCount = getCount(translationGroup)

  if (
    selectedTranslationGroup &&
    selectedTranslationGroup.keyPath.join('.') == translationGroup.keyPath.join('.')
  ) {
    return (
      <ColumnKeyContainer data={props.data}>
        <Input
          value={selectedTranslationGroup.key}
          onChange={e =>
            setSelectedTranslationGroup({
              ...selectedTranslationGroup,
              key: e.target.value,
              translations: selectedTranslationGroup.translations.map(obj => ({
                ...obj,
                key: e.target.value,
              })),
            } as TranslationGroup)
          }
        />
      </ColumnKeyContainer>
    )
  }

  return (
    <ColumnKeyContainer data={props.data}>
      {props.data.row.getCanExpand() ? (
        <Text fontWeight="semibold">
          {translationGroup.key}{' '}
          <Text as="span" fontWeight="normal" fontSize={12}>
            (
            <Text as="span">
              {translationCount} {translationCount == 1 ? 'Translation' : 'Translations'}
            </Text>
            )
          </Text>
        </Text>
      ) : (
        <Text>{translationGroup.key}</Text>
      )}
    </ColumnKeyContainer>
  )
}

export default ColumnKeyCell

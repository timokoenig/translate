import { Translation, TranslationGroup } from '@/utils/models'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import { useTranslationStore } from '@/utils/store/translation/translation-context'
import { HStack, Text, Textarea, VStack } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'

type Props = {
  data: CellContext<TranslationGroup, unknown>
}

const ColumnValueCell = (props: Props) => {
  const { filter, currentRepo } = useRepoStore()
  const { selectedTranslationGroup, setSelectedTranslationGroup, isLoading } = useTranslationStore()
  const translationGroup = props.data.getValue() as TranslationGroup
  if (translationGroup.children.length > 0) {
    return <></>
  }

  const translationFilter = (translation: Translation): boolean => {
    if (filter.language && translation.lang != filter.language) {
      return false
    }
    return true
  }

  const translationSorter = (a: Translation, b: Translation) =>
    a.lang > b.lang ? 1 : a.lang < b.lang ? -1 : 0

  if (
    selectedTranslationGroup &&
    selectedTranslationGroup.keyPath.join('.') == translationGroup.keyPath.join('.')
  ) {
    return (
      <VStack w="full">
        {selectedTranslationGroup.translations
          .filter(translationFilter)
          .sort(translationSorter)
          .map((obj, index) => (
            <HStack key={index} w="full">
              <Text>{currentRepo.languages.find(lang => lang.code == obj.lang)?.emoji}</Text>
              <Textarea
                value={obj.value}
                isDisabled={isLoading}
                onChange={e => {
                  if (!selectedTranslationGroup) return
                  const updatedTranslation = {
                    ...obj,
                    value: e.target.value,
                  }
                  setSelectedTranslationGroup({
                    ...selectedTranslationGroup,
                    translations: [
                      ...selectedTranslationGroup.translations.filter(
                        oldTranslation => oldTranslation.lang != obj.lang
                      ),
                      updatedTranslation,
                    ],
                  } as TranslationGroup)
                }}
              />
            </HStack>
          ))}
      </VStack>
    )
  }

  return (
    <VStack w="full">
      {translationGroup.translations
        .filter(obj => translationFilter(obj))
        .sort(translationSorter)
        .map((obj, index) => (
          <HStack key={index} w="full">
            <Text whiteSpace="initial">
              {currentRepo.languages.find(lang => lang.code == obj.lang)?.emoji}
            </Text>
            <Text whiteSpace="initial" w="full">
              {obj.value}
            </Text>
          </HStack>
        ))}
    </VStack>
  )
}

export default ColumnValueCell

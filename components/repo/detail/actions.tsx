import { useRepoStore } from '@/utils/store/repo/repo-context'
import {
  Box,
  Button,
  HStack,
  Select,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import CreateTranslationModal from './modal/create'

const Actions = () => {
  const { getCategories, getLanguages, filter, setFilter, addTranslation } = useRepoStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const languages = getLanguages()
  const categories = getCategories()

  const onChangeCategory = (value: number): void => {
    if (value == -1) {
      setFilter({ ...filter, category: null })
      return
    }
    const category = categories[value]
    setFilter({ ...filter, category })
  }

  const onChangeLanguage = (value: number): void => {
    if (value == -1) {
      setFilter({ ...filter, language: null })
      return
    }
    const language = languages[value].code
    setFilter({ ...filter, language })
  }

  const onChangeMissingTranslations = (): void =>
    setFilter({ ...filter, missingTranslations: !filter.missingTranslations })

  const onResetFilter = () => {
    setFilter({ category: null, language: null, missingTranslations: false })
  }

  const resetEnabled = filter.category || filter.language || filter.missingTranslations

  const onAddTranslation = async (
    key: string,
    value: string,
    lang: string,
    category: string
  ): Promise<void> => addTranslation({ key, value, lang }, lang, category)

  return (
    <Box p={8}>
      <HStack gap={4}>
        <Select
          value={categories.findIndex(obj => obj == filter.category)}
          onChange={e => onChangeCategory(Number(e.target.value))}
          w="auto"
          display={{ base: 'none', md: 'flex' }}
        >
          <option value={-1}>All Categories</option>
          {getCategories().map((obj, index) => (
            <option key={index} value={index}>
              {obj}
            </option>
          ))}
        </Select>

        <Select
          value={languages.findIndex(obj => obj.code == filter.language)}
          onChange={e => onChangeLanguage(Number(e.target.value))}
          w="auto"
          display={{ base: 'none', md: 'flex' }}
        >
          <option value={-1}>All Languages</option>
          {getLanguages().map((obj, index) => (
            <option key={index} value={index}>
              {`${obj.emoji} ${obj.name}`}
            </option>
          ))}
        </Select>

        <HStack
          borderWidth={1}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          borderRadius={6}
          p={2}
          display={{ base: 'none', md: 'flex' }}
        >
          <Text>Missing Translations</Text>
          <Switch
            isChecked={filter.missingTranslations}
            size="sm"
            onChange={onChangeMissingTranslations}
          />
        </HStack>

        {resetEnabled && (
          <Button variant="ghost" colorScheme="red" onClick={onResetFilter}>
            Reset Filter
          </Button>
        )}

        <Box flex={1} />
        <Button leftIcon={<FiPlus />} variant="primary" onClick={onOpen}>
          Add Translation
        </Button>
        <CreateTranslationModal isOpen={isOpen} onClose={onClose} onAdd={onAddTranslation} />
      </HStack>
    </Box>
  )
}

export default Actions

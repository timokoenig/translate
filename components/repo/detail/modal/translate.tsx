import LoadingIndicator from '@/components/global/loading-indicator'
import { Translation, TranslationGroup } from '@/utils/models'
import languageJson from '@/utils/resources/languages.json'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import { useSettingsStore } from '@/utils/store/settings/settings-context'
import translateWithGoogleTranslate from '@/utils/translate-with-google-translate'
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  translationGroup: TranslationGroup
}

type TranslationItem = {
  translation: Translation
  selected: boolean
}

const TranslateModal = (props: Props) => {
  const { currentRepo, updateTranslationGroup } = useRepoStore()
  const { getTranslationApiKey } = useSettingsStore()
  const [baseLanguage, setBaseLanguage] = useState<string>('')
  const [translations, setTranslations] = useState<TranslationItem[]>([])
  const [isRequesting, setRequesting] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  const baseLanguageEmoji =
    languageJson.find(lang => lang.code.toLowerCase() == baseLanguage.toLowerCase())?.emoji ??
    baseLanguage.toUpperCase()
  const baseLanguageValue = props.translationGroup.translations.find(
    obj => obj.lang == baseLanguage
  )?.value

  const onSave = async (): Promise<void> => {
    const updatedTranslationGroup: TranslationGroup = JSON.parse(
      JSON.stringify(props.translationGroup)
    )
    updatedTranslationGroup.translations = updatedTranslationGroup.translations.map(translation => {
      const updatedTranslation = translations.find(
        obj => obj.translation.lang == translation.lang && obj.selected
      )
      if (updatedTranslation) {
        return updatedTranslation.translation
      }
      return translation
    })
    setLoading(true)
    await updateTranslationGroup(props.translationGroup, updatedTranslationGroup)
    props.onClose()
  }

  const onChangeLanguage = async (value: string): Promise<void> => {
    setBaseLanguage(value)
    setTranslations([])

    const baseValue = props.translationGroup.translations.find(obj => obj.lang == value)?.value
    if (baseValue == undefined || baseValue.length == 0 || value == '') return // nothing to translate

    const apiKey = getTranslationApiKey()
    if (!apiKey) return

    setLoading(true)
    setRequesting(true)
    try {
      const items = await Promise.all(
        props.translationGroup.translations
          .filter(obj => obj.lang != value)
          .map(async obj => {
            const res = await translateWithGoogleTranslate(baseValue, obj.lang, apiKey)
            const item: TranslationItem = {
              translation: {
                ...obj,
                value: res.translatedText,
              },
              selected: true,
            }
            return item
          })
      )
      setTranslations(items)
    } catch (err: unknown) {
      console.log(err)
    }
    setRequesting(false)
    setLoading(false)
  }

  useEffect(() => {
    setBaseLanguage('')
    setTranslations([])
    setLoading(false)
    setRequesting(false)
  }, [props])

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Translate</Heading>
          <Text fontWeight="normal" fontSize={16}>
            {props.translationGroup.keyPath}
          </Text>
        </ModalHeader>

        <ModalBody>
          <VStack alignItems="left" mb={4} gap={4}>
            <Select
              id="language"
              value={baseLanguage}
              onChange={e => onChangeLanguage(e.target.value)}
              isDisabled={isLoading}
            >
              <option key="" value="">
                Select your base language
              </option>
              {currentRepo.languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.emoji} {lang.name}
                </option>
              ))}
            </Select>
            {baseLanguage != '' && (baseLanguageValue?.length ?? 0) > 0 && (
              <HStack>
                <Checkbox isChecked disabled={true} />
                <Box>{baseLanguageEmoji}</Box>
                <Text>{baseLanguageValue}</Text>
              </HStack>
            )}
            {baseLanguage != '' && baseLanguageValue?.length == 0 && (
              <Text color="red" textAlign="center">
                Nothing to translate
                <br />
                Please select another base language
              </Text>
            )}
            {isRequesting && <LoadingIndicator />}
            {translations.map(obj => {
              const translation = obj.translation
              const langEmoji =
                languageJson.find(lang => lang.code.toLowerCase() == translation.lang.toLowerCase())
                  ?.emoji ?? translation.lang.toUpperCase()
              return (
                <HStack key={translation.lang}>
                  <Checkbox
                    isChecked={obj.selected}
                    isDisabled={isLoading}
                    onChange={() => {
                      setTranslations(
                        translations.map(t => ({
                          ...t,
                          selected:
                            t.translation.lang == translation.lang ? !obj.selected : t.selected,
                        }))
                      )
                    }}
                  />
                  <Box>{langEmoji}</Box>
                  <Text>{translation.value}</Text>
                </HStack>
              )
            })}
            {translations.length > 0 && <Text>Select all translations that you want to keep</Text>}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack alignItems="right">
            <Button variant="outline" isLoading={isLoading} onClick={props.onClose}>
              Close
            </Button>
            {translations.length > 0 && (
              <Button variant="primary" isLoading={isLoading} onClick={onSave}>
                Save
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TranslateModal

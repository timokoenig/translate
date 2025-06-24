import { useSettingsStore } from '@/utils/store/settings/settings-context'
import { CheckIcon } from '@chakra-ui/icons'
import {
  Button,
  Container,
  Heading,
  Input,
  InputGroup,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { BsTranslate } from 'react-icons/bs'

const AutomaticTranslation = () => {
  const { getTranslationApiKey, setTranslationApiKey } = useSettingsStore()
  const [apiKey, setApiKey] = useState<string>(getTranslationApiKey() ?? '')
  const [isDirty, setDirty] = useState<boolean>(false)

  const onFokusInput = () => {
    if (isDirty) return
    setApiKey('')
    setDirty(true)
  }

  const onChangeApiKey = (value: string) => {
    setApiKey(value)
    setDirty(true)
  }

  const onSaveApiKey = () => {
    setTranslationApiKey(apiKey == '' ? null : apiKey)
    setDirty(false)
  }

  return (
    <Container py={8}>
      <VStack gap={4} alignItems="left">
        <Heading as="h2" size="md">
          Automatic Translation
        </Heading>
        <Text>
          Enter your{' '}
          <Link href="https://cloud.google.com/translate/docs/setup" target="_blank" color="pink">
            Google Translate API Key
          </Link>{' '}
          to enable the translation feature. With a click on a button you can automatically
          translate single translations.
        </Text>
        <InputGroup
          startElement={<BsTranslate />}
          startElementProps={{ pointerEvents: "none" }}
          endElement={
            isDirty ? (
              <Button h="1.75rem" size="sm" onClick={onSaveApiKey}>
                save
              </Button>
            ) : apiKey.length > 0 ? (
              <CheckIcon color="green.500" />
            ) : null
          }
          endElementProps={isDirty ? { width: "4rem" } : undefined}
        >
          <Input
            value={
              isDirty
                ? apiKey
                : apiKey === ""
                ? ""
                : `${apiKey.slice(0, 8)}…`
            }
            placeholder="Enter your Google Translate API Key"
            onClick={onFokusInput}
            onChange={e => onChangeApiKey(e.target.value.trim())}
            ps="2rem"
            pe={isDirty ? "4rem" : undefined}
          />
        </InputGroup>
        <Text fontSize={12}>
          (Note: Please read the{' '}
          <Link href="https://cloud.google.com/translate/data-usage" target="_blank" color="pink">
            Google Translate data privacy statements
          </Link>{' '}
          because your selected data will be shared with to their services)
        </Text>
      </VStack>
    </Container>
  )
}

export default AutomaticTranslation

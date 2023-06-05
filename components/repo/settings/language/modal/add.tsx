import * as Form from '@/components/global/form'
import languages from '@/utils/resources/languages.json'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { Formik, FormikContextType } from 'formik'
import { useEffect, useRef } from 'react'
import { FiPlus } from 'react-icons/fi'
import * as Yup from 'yup'

const AddLanguageModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addLanguage, currentRepo } = useRepoStore()
  const existingLanguages = currentRepo.languages.map(obj => obj.code)
  const availableLanguages = languages
    .map(obj => ({ code: obj.code, name: obj.name, emoji: obj.emoji ?? '' }))
    .filter(obj => !existingLanguages.includes(obj.code))

  const validationSchema = Yup.object().shape({
    language: Yup.string()
      .trim()
      .required('Language is required')
      .notOneOf(existingLanguages, 'Language already exists'),
  })

  const initialValues: Yup.Asserts<typeof validationSchema> = {
    language: availableLanguages[0].code,
  }

  const onSubmit = async (values: Yup.Asserts<typeof validationSchema>) => {
    try {
      const newLanguage = languages.find(obj => obj.code == values.language)
      if (!newLanguage) return
      await addLanguage({
        code: newLanguage.code,
        name: newLanguage.name,
        emoji: newLanguage.emoji ?? '',
      })
      onClose()
    } catch (err: unknown) {
      console.log(err)
    }
  }

  const formRef = useRef<FormikContextType<Yup.Asserts<typeof validationSchema>>>(null)

  useEffect(() => {
    formRef.current?.resetForm()
  }, [isOpen])

  return (
    <>
      <Button leftIcon={<FiPlus />} variant="primary" onClick={onOpen}>
        Add Language
      </Button>

      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Language</ModalHeader>

            <ModalBody>
              <Stack spacing={4}>
                <Form.Select
                  id="language"
                  label="Language"
                  values={availableLanguages.map(obj => ({
                    key: obj.code,
                    value: `${obj.emoji} ${obj.name}`,
                  }))}
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <HStack alignItems="right">
                <Form.Button label="Close" variant="outline" onClick={onClose} />
                <Form.Button label="Add Language" variant="primary" />
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Formik>
    </>
  )
}

export default AddLanguageModal

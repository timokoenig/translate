/* eslint-disable react-hooks/exhaustive-deps */
import languages from '@/utils/resources/languages.json'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import * as Yup from 'yup'

const AddLanguageModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addLanguage, getLanguages } = useRepoStore()
  const existingLanguages = getLanguages().map(obj => obj.code)
  const availableLanguages = languages
    .map(obj => ({ code: obj.code, name: obj.name, emoji: obj.emoji ?? '' }))
    .filter(obj => !existingLanguages.includes(obj.code))

  const validationSchema = Yup.object().shape({
    language: Yup.string()
      .trim()
      .required('Language is required')
      .notOneOf(existingLanguages, 'Language already exists'),
  })

  const formik = useFormik({
    initialValues: {
      language: availableLanguages[0].code,
    },
    validationSchema,
    onSubmit: async values => {
      if (!formik.isValid) return
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
    },
  })

  useEffect(() => {
    formik.resetForm()
  }, [isOpen])

  return (
    <>
      <Button leftIcon={<FiPlus />} variant="primary" onClick={onOpen}>
        Add Language
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Language</ModalHeader>

          <ModalBody>
            <Stack spacing={4}>
              <FormControl
                isRequired
                isDisabled={formik.isSubmitting}
                isInvalid={formik.errors.language !== undefined && formik.touched.language}
              >
                <FormLabel htmlFor="language">Language</FormLabel>
                <Select id="language" value={formik.values.language} onChange={formik.handleChange}>
                  {availableLanguages.map((obj, index) => (
                    <option key={index} value={obj.code}>
                      {obj.emoji} {obj.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{formik.errors.language}</FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} variant="outline" disabled={formik.isSubmitting}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => formik.handleSubmit()}
              ml={4}
              isLoading={formik.isSubmitting}
            >
              Add Language
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddLanguageModal

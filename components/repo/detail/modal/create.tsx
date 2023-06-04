/* eslint-disable react-hooks/exhaustive-deps */
import { useRepoStore } from '@/utils/store/repo/repo-context'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import * as Yup from 'yup'

type Props = {
  isOpen: boolean
  onClose: () => void
  onAdd: (key: string, value: string, lang: string, category: string) => Promise<void>
  categoryEnabled?: boolean
}

const CreateTranslationModal = (props: Props) => {
  const { translationGroups, currentRepo } = useRepoStore()
  const existingTranslationKeys = translationGroups.map(obj => obj.key)

  const validationSchema = Yup.object().shape({
    key: Yup.string()
      .min(1, 'Key name must be at least one character long')
      .trim()
      .required('Key name is required')
      .notOneOf(existingTranslationKeys, 'Key already exists'),
    value: Yup.string().trim().optional(),
    lang: Yup.string()
      .trim()
      .required()
      .oneOf(
        currentRepo.languages.map(obj => obj.code),
        'Language not allowed'
      ),
    category:
      props.categoryEnabled == false
        ? Yup.string().optional()
        : Yup.string().trim().required().oneOf(currentRepo.categories, 'Category not allowed'),
  })

  const formik = useFormik({
    initialValues: {
      key: '',
      value: '',
      lang: currentRepo.languages[0].code,
      category: currentRepo.categories[0],
    },
    validationSchema,
    onSubmit: async values => {
      if (!formik.isValid) return
      try {
        await props.onAdd(values.key, values.value, values.lang, values.category)
        props.onClose()
      } catch (err: unknown) {
        console.log(err)
      }
    },
  })

  useEffect(() => {
    formik.resetForm()
  }, [props.isOpen])

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Translation</ModalHeader>

        <ModalBody>
          <Stack spacing={4}>
            <FormControl
              isRequired
              isDisabled={formik.isSubmitting}
              isInvalid={formik.errors.key !== undefined && formik.touched.key}
            >
              <FormLabel htmlFor="key">Key name</FormLabel>
              <Input id="key" value={formik.values.key} onChange={formik.handleChange} />
              <FormErrorMessage>{formik.errors.key}</FormErrorMessage>
            </FormControl>
            <FormControl
              isDisabled={formik.isSubmitting}
              isInvalid={formik.errors.value !== undefined && formik.touched.value}
            >
              <FormLabel htmlFor="value">Value</FormLabel>
              <Textarea id="value" value={formik.values.value} onChange={formik.handleChange} />
              <FormErrorMessage>{formik.errors.value}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isDisabled={formik.isSubmitting}
              isInvalid={formik.errors.lang !== undefined && formik.touched.lang}
            >
              <FormLabel htmlFor="lang">Language</FormLabel>
              <Select id="lang" value={formik.values.lang} onChange={formik.handleChange}>
                {currentRepo.languages.map((obj, index) => (
                  <option key={index} value={obj.code}>
                    {obj.emoji} {obj.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formik.errors.lang}</FormErrorMessage>
            </FormControl>

            {(props.categoryEnabled == undefined || props.categoryEnabled == true) && (
              <FormControl
                isRequired
                isDisabled={formik.isSubmitting}
                isInvalid={formik.errors.category !== undefined && formik.touched.category}
              >
                <FormLabel htmlFor="category">Category</FormLabel>
                <Select id="category" value={formik.values.category} onChange={formik.handleChange}>
                  {currentRepo.categories.map((obj, index) => (
                    <option key={index} value={obj}>
                      {obj}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
              </FormControl>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={props.onClose} variant="outline" disabled={formik.isSubmitting}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => formik.handleSubmit()}
            ml={4}
            isLoading={formik.isSubmitting}
          >
            Add Key
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateTranslationModal

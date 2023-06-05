import * as Form from '@/components/global/form'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import { Formik, FormikContextType } from 'formik'
import { useEffect, useRef } from 'react'
import * as Yup from 'yup'

type Props = {
  isOpen: boolean
  onClose: () => void
  onAdd: (key: string, value: string, lang: string, category: string) => Promise<void>
  translationCategory?: string
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
    category: props.translationCategory
      ? Yup.string().optional()
      : Yup.string().trim().required().oneOf(currentRepo.categories, 'Category not allowed'),
  })

  const initialValues: Yup.Asserts<typeof validationSchema> = {
    key: '',
    value: '',
    lang: currentRepo.languages[0].code,
    category: currentRepo.categories[0],
  }

  const onSubmit = async (values: Yup.Asserts<typeof validationSchema>) => {
    try {
      await props.onAdd(
        values.key,
        values.value ?? '',
        values.lang,
        values.category ?? props.translationCategory ?? ''
      )
      props.onClose()
    } catch (err: unknown) {
      console.log(err)
    }
  }

  const formRef = useRef<FormikContextType<Yup.Asserts<typeof validationSchema>>>(null)

  useEffect(() => {
    formRef.current?.resetForm()
  }, [props.isOpen])

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Translation</ModalHeader>

          <ModalBody>
            <Stack spacing={4}>
              <Form.Input id="key" label="Key name" />
              <Form.Input id="value" label="Value" />
              <Form.Select
                id="lang"
                label="Language"
                values={currentRepo.languages.map(obj => ({
                  key: obj.code,
                  value: `${obj.emoji} ${obj.name}`,
                }))}
              />

              {props.translationCategory == undefined && (
                <Form.Select
                  id="category"
                  label="Category"
                  values={currentRepo.categories.map(obj => ({
                    key: obj,
                    value: obj,
                  }))}
                />
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <HStack alignItems="right">
              <Form.Button label="Close" variant="outline" onClick={props.onClose} />
              <Form.Button label="Add Key" variant="primary" />
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Formik>
  )
}

export default CreateTranslationModal

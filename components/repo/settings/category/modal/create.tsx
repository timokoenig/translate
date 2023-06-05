import * as Form from '@/components/global/form'
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

const CreateCategoryModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addCategory, currentRepo } = useRepoStore()

  const validationSchema = Yup.object().shape({
    category: Yup.string()
      .min(1, 'Category name must be at least one character long')
      .trim()
      .required('Category name is required')
      .notOneOf(currentRepo.categories, 'Category name already exists'),
  })

  const initialValues: Yup.Asserts<typeof validationSchema> = {
    category: '',
  }

  const onSubmit = async (values: Yup.Asserts<typeof validationSchema>) => {
    try {
      await addCategory(values.category)
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
        Add Category
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
            <ModalHeader>Add Category</ModalHeader>

            <ModalBody>
              <Stack spacing={4}>
                <Form.Input id="category" label="Category name" />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <HStack alignItems="right">
                <Form.Button label="Close" variant="outline" onClick={onClose} />
                <Form.Button label="Add Category" variant="primary" />
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Formik>
    </>
  )
}

export default CreateCategoryModal

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Stack,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import { useEffect } from "react";

const CreateCategoryModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addCategory, getCategories } = useRepoStore();
  const existingCategories = getCategories();

  const validationSchema = Yup.object().shape({
    category: Yup.string()
      .min(1, "Category name must be at least one character long")
      .trim()
      .required("Category name is required")
      .notOneOf(existingCategories, "Category name already exists"),
  });

  const formik = useFormik({
    initialValues: {
      category: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!formik.isValid) return;
      try {
        await addCategory(values.category);
        onClose();
      } catch (err: unknown) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    formik.resetForm();
  }, [isOpen]);

  return (
    <>
      <Button leftIcon={<FiPlus />} variant="primary" onClick={onOpen}>
        Add Category
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>

          <ModalBody>
            <Stack spacing={4}>
              <FormControl
                isRequired
                isDisabled={formik.isSubmitting}
                isInvalid={
                  formik.errors.category !== undefined &&
                  formik.touched.category
                }
              >
                <FormLabel htmlFor="category">Category name</FormLabel>
                <Input
                  id="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={formik.isSubmitting}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => formik.handleSubmit()}
              ml={4}
              isLoading={formik.isSubmitting}
            >
              Add Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCategoryModal;

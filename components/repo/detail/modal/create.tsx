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
  Select,
  Textarea,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import { useEffect } from "react";

const CreateTranslationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addTranslation, getTranslationGroups, getCategories, getLanguages } =
    useRepoStore();
  const categories = getCategories();
  const languages = getLanguages();
  const existingTranslationKeys = getTranslationGroups().map((obj) => obj.key);

  const validationSchema = Yup.object().shape({
    key: Yup.string()
      .min(1, "Key name must be at least one character long")
      .trim()
      .required("Key name is required")
      .notOneOf(existingTranslationKeys, "Key already exists"),
    value: Yup.string().trim().optional(),
    lang: Yup.string()
      .trim()
      .required()
      .oneOf(
        languages.map((obj) => obj.code),
        "Language not allowed"
      ),
    category: Yup.string()
      .trim()
      .required()
      .oneOf(categories, "Category not allowed"),
  });

  const formik = useFormik({
    initialValues: {
      key: "",
      value: "",
      lang: languages[0].code,
      category: categories[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!formik.isValid) return;
      try {
        await addTranslation(
          { key: values.key, value: values.value, lang: values.lang },
          values.lang,
          values.category
        );
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
        Add Translation
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Translation</ModalHeader>

          <ModalBody>
            <Stack spacing={4}>
              <FormControl
                isRequired
                isDisabled={formik.isSubmitting}
                isInvalid={
                  formik.errors.key !== undefined && formik.touched.key
                }
              >
                <FormLabel htmlFor="key">Key name</FormLabel>
                <Input
                  id="key"
                  value={formik.values.key}
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors.key}</FormErrorMessage>
              </FormControl>
              <FormControl
                isDisabled={formik.isSubmitting}
                isInvalid={
                  formik.errors.value !== undefined && formik.touched.value
                }
              >
                <FormLabel htmlFor="value">Value</FormLabel>
                <Textarea
                  id="value"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors.value}</FormErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isDisabled={formik.isSubmitting}
                isInvalid={
                  formik.errors.lang !== undefined && formik.touched.lang
                }
              >
                <FormLabel htmlFor="lang">Language</FormLabel>
                <Select id="lang" value={-1} onChange={formik.handleChange}>
                  {languages.map((obj, index) => (
                    <option key={index} value={index}>
                      {obj.emoji} {obj.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{formik.errors.lang}</FormErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isDisabled={formik.isSubmitting}
                isInvalid={
                  formik.errors.category !== undefined &&
                  formik.touched.category
                }
              >
                <FormLabel htmlFor="category">Category</FormLabel>
                <Select id="category" value={-1} onChange={formik.handleChange}>
                  {categories.map((obj, index) => (
                    <option key={index} value={index}>
                      {obj}
                    </option>
                  ))}
                </Select>
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
              Add Key
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTranslationModal;

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

const CreateTranslationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addTranslation, translationFile } = useRepoStore();

  const validationSchema = Yup.object().shape({
    key: Yup.string()
      .min(1, "Key name must be at least one character long")
      .trim()
      .notOneOf(Object.keys(translationFile?.data ?? {}), "Key already exists")
      .required("Key name is required"),
    value: Yup.string().trim().optional(),
  });

  const formik = useFormik({
    initialValues: {
      key: "",
      value: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!formik.isValid) return;
      try {
        await addTranslation(values);
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
      <Button
        leftIcon={<FiPlus />}
        bgGradient="linear(to-r, red.400,pink.400)"
        color="white"
        _hover={{
          bgGradient: "linear(to-r, red.500,pink.500)",
        }}
        variant="solid"
        onClick={onOpen}
      >
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
                <Input
                  id="value"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                />
                <FormErrorMessage>{formik.errors.value}</FormErrorMessage>
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
              bgGradient="linear(to-r, red.400,pink.400)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, red.500,pink.500)",
              }}
              variant="solid"
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

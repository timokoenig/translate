import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

type Props = {
  title: string;
  message: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmationModal = (props: Props) => (
  <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{props.title}</ModalHeader>

      <ModalBody>
        <Text>{props.message}</Text>
      </ModalBody>

      <ModalFooter>
        <Button onClick={props.onClose} variant="outline">
          No
        </Button>
        <Button
          bgGradient="linear(to-r, red.400,pink.400)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, red.500,pink.500)",
          }}
          variant="solid"
          onClick={() => {
            props.onConfirm();
            props.onClose();
          }}
          ml={4}
        >
          Yes
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConfirmationModal;

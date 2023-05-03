import {
  Text,
  Td,
  Tr,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import { useState } from "react";
import ConfirmationModal from "@/components/global/modal/confirmation";
import { FiMoreVertical } from "react-icons/fi";
import Infobox from "@/components/global/infobox";
import { Language } from "@/utils/models";

type Props = {
  language: Language;
};

const LanguageTableRow = (props: Props) => {
  const { deleteLanguage, getLanguages } = useRepoStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState<boolean>(false);

  // A repo always needs to have at least one language
  const deleteEnabled = getLanguages().length > 1;

  const onDelete = async () => {
    setLoading(true);
    await deleteLanguage(props.language);
    setLoading(false);
  };

  return (
    <Tr>
      <Td w="full">
        <Text fontWeight="semibold">
          {props.language.emoji} {props.language.name}
        </Text>
      </Td>
      <Td>
        {deleteEnabled && (
          <HStack w="full">
            <HStack w="full" alignItems="flex-start">
              <Popover placement="left-start" computePositionOnMount>
                <PopoverTrigger>
                  <IconButton
                    aria-label="More Button"
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    isLoading={isLoading}
                  />
                </PopoverTrigger>
                <PopoverContent w="auto">
                  <PopoverBody>
                    <VStack w="full">
                      <Button
                        aria-label="Delete Button"
                        leftIcon={<DeleteIcon />}
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e) => {
                          e.preventDefault();
                          onOpen();
                        }}
                        isLoading={isLoading}
                      >
                        Delete
                      </Button>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <ConfirmationModal
                title="Delete Language"
                message={
                  <>
                    <Text mb={8}>
                      Do you want to delete{" "}
                      <Text fontWeight="semibold" as="span">
                        {props.language.name}
                      </Text>
                      ?
                    </Text>
                    <Infobox text="Deleting this language will also delete all translations for it!" />
                  </>
                }
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                onConfirm={onDelete}
              />
            </HStack>
          </HStack>
        )}
      </Td>
    </Tr>
  );
};

export default LanguageTableRow;

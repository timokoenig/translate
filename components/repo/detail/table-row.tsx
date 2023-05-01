import { Translation } from "@/utils/models";
import {
  Text,
  Td,
  Tr,
  HStack,
  Textarea,
  IconButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/global/modal/confirmation";

type Props = {
  translation: Translation;
};

const RepositoryDetailListRow = (props: Props) => {
  const { updateTranslation, deleteTranslation } = useRepoStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [translationKey, setTranslationKey] = useState<string>(
    props.translation.key
  );
  const [translationValue, setTranslationValue] = useState<string>(
    props.translation.value
  );
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onEdit = () => setEditing(true);

  const onConfirm = async () => {
    setLoading(true);
    await updateTranslation(props.translation, {
      key: translationKey,
      value: translationValue,
    });
    setEditing(false);
    setLoading(false);
  };

  const onCancel = () => {
    setTranslationKey(props.translation.key);
    setTranslationValue(props.translation.value);
    setEditing(false);
  };

  const onDelete = async () => {
    setLoading(true);
    await deleteTranslation(props.translation);
    setEditing(false);
    setLoading(false);
  };

  useEffect(() => {
    setTranslationKey(props.translation.key);
    setTranslationValue(props.translation.value);
  }, [props]);

  return (
    <Tr>
      <Td w="40%">
        {isEditing ? (
          <Input
            value={translationKey}
            onChange={(e) => setTranslationKey(e.target.value)}
            disabled={isLoading}
          />
        ) : (
          <Text fontWeight="semibold">{props.translation.key}</Text>
        )}
      </Td>
      <Td w="60%">
        <HStack w="full">
          {isEditing ? (
            <HStack w="full">
              <Textarea
                value={translationValue}
                onChange={(e) => setTranslationValue(e.target.value)}
                disabled={isLoading}
              />
              <IconButton
                aria-label="Confirm Button"
                icon={<CheckIcon />}
                colorScheme="green"
                onClick={async (e) => {
                  e.preventDefault();
                  onConfirm();
                }}
                isLoading={isLoading}
              />
              <IconButton
                aria-label="Close Button"
                icon={<CloseIcon />}
                colorScheme="red"
                onClick={(e) => {
                  e.preventDefault();
                  onCancel();
                }}
                isLoading={isLoading}
              />
            </HStack>
          ) : (
            <HStack w="full">
              <Text w="full">{props.translation.value}</Text>
              <IconButton
                aria-label="Edit Button"
                icon={<EditIcon />}
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit();
                }}
                isLoading={isLoading}
              />
              <IconButton
                aria-label="Delete Button"
                icon={<DeleteIcon />}
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.preventDefault();
                  onOpen();
                }}
                isLoading={isLoading}
              />
              <ConfirmationModal
                title="Delete Translation"
                message={`Do you want to delete '${props.translation.key}'?`}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                onConfirm={onDelete}
              />
            </HStack>
          )}
        </HStack>
      </Td>
    </Tr>
  );
};

export default RepositoryDetailListRow;

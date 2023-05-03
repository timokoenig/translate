import { Translation, TranslationGroup } from "@/utils/models";
import {
  Text,
  Td,
  Tr,
  Textarea,
  IconButton,
  Input,
  useDisclosure,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/global/modal/confirmation";

type Props = {
  translationGroup: TranslationGroup;
};

const RepositoryDetailListRow = (props: Props) => {
  const { updateTranslationGroup, deleteTranslationGroup } = useRepoStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [translationKey, setTranslationKey] = useState<string>(
    props.translationGroup.key
  );
  const [translations, setTranslations] = useState<Translation[]>(
    props.translationGroup.translations
  );
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onEdit = () => setEditing(true);

  const onConfirm = async () => {
    setLoading(true);
    await updateTranslationGroup(props.translationGroup, {
      ...props.translationGroup,
      key: translationKey,
      translations,
    });
    setEditing(false);
    setLoading(false);
  };

  const onCancel = () => {
    setTranslationKey(props.translationGroup.key);
    setTranslations(props.translationGroup.translations);
    setEditing(false);
  };

  const onDelete = async () => {
    setLoading(true);
    await deleteTranslationGroup(props.translationGroup);
    setEditing(false);
    setLoading(false);
  };

  useEffect(() => {
    setTranslationKey(props.translationGroup.key);
    setTranslations(props.translationGroup.translations);
  }, [props]);

  return (
    <Tr>
      <Td w="30%" verticalAlign="top">
        {isEditing ? (
          <Input
            value={translationKey}
            onChange={(e) => setTranslationKey(e.target.value)}
            disabled={isLoading}
          />
        ) : (
          <VStack w="full" alignItems="left">
            <Text fontWeight="semibold">{props.translationGroup.key}</Text>
            <Text>{props.translationGroup.category}</Text>
          </VStack>
        )}
      </Td>
      <Td w="70%" verticalAlign="top">
        <HStack w="full">
          {isEditing ? (
            <HStack w="full">
              <VStack w="full">
                {translations.map((obj, index) => (
                  <HStack key={index} w="full">
                    <Text>{obj.lang.toUpperCase()}: </Text>
                    <Textarea
                      value={obj.value}
                      onChange={(e) => {
                        const updatedTranslation = {
                          ...obj,
                          value: e.target.value,
                        };
                        setTranslations([
                          ...translations.filter(
                            (oldTranslation) => oldTranslation.key != obj.key
                          ),
                          updatedTranslation,
                        ]);
                      }}
                      disabled={isLoading}
                    />
                  </HStack>
                ))}
              </VStack>
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
            <HStack w="full" verticalAlign="top">
              <VStack w="full">
                {props.translationGroup.translations.map((obj, index) => (
                  <HStack key={index} w="full">
                    <Text whiteSpace="initial">{obj.lang.toUpperCase()}: </Text>
                    <Text whiteSpace="initial" w="full">
                      {obj.value}
                    </Text>
                  </HStack>
                ))}
              </VStack>

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
                message={
                  <Text>
                    Do you want to delete{" "}
                    <Text fontWeight="semibold" as="span">
                      {props.translationGroup.key}
                    </Text>
                    ?
                  </Text>
                }
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

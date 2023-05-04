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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/global/modal/confirmation";
import { FiMoreVertical } from "react-icons/fi";

type Props = {
  translationGroup: TranslationGroup;
};

const RepositoryDetailListRow = (props: Props) => {
  const {
    updateTranslationGroup,
    deleteTranslationGroup,
    getLanguages,
    filter,
  } = useRepoStore();
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

  const translationFilter = (translation: Translation): boolean => {
    if (filter.language && translation.lang != filter.language) {
      return false;
    }
    return true;
  };

  const translationSorter = (a: Translation, b: Translation) =>
    a.lang > b.lang ? 1 : a.lang < b.lang ? -1 : 0;

  useEffect(() => {
    setTranslationKey(props.translationGroup.key);
    setTranslations(props.translationGroup.translations);
  }, [props]);

  return (
    <Tr _last={{ td: { borderBottom: "0px" } }}>
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
                {translations
                  .filter(translationFilter)
                  .sort(translationSorter)
                  .map((obj, index) => (
                    <HStack key={index} w="full">
                      <Text>
                        {
                          getLanguages().find((lang) => lang.code == obj.lang)
                            ?.emoji
                        }
                      </Text>
                      <Textarea
                        value={obj.value}
                        onChange={(e) => {
                          const updatedTranslation = {
                            ...obj,
                            value: e.target.value,
                          };
                          setTranslations([
                            ...translations.filter(
                              (oldTranslation) =>
                                oldTranslation.lang != obj.lang
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
                size="sm"
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
                size="sm"
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
            <HStack w="full" alignItems="flex-start">
              <VStack w="full">
                {props.translationGroup.translations
                  .filter(translationFilter)
                  .sort(translationSorter)
                  .map((obj, index) => (
                    <HStack key={index} w="full">
                      <Text whiteSpace="initial">
                        {
                          getLanguages().find((lang) => lang.code == obj.lang)
                            ?.emoji
                        }
                      </Text>
                      <Text whiteSpace="initial" w="full">
                        {obj.value}
                      </Text>
                    </HStack>
                  ))}
              </VStack>

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
                        w="full"
                        aria-label="Edit Button"
                        leftIcon={<EditIcon />}
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit();
                        }}
                        isLoading={isLoading}
                      >
                        Edit
                      </Button>

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

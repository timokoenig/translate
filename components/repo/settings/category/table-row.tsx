import {
  Text,
  Td,
  Tr,
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
import Infobox from "@/components/global/infobox";

type Props = {
  category: string;
};

const CategoryTableRow = (props: Props) => {
  const { updateCategory, deleteCategory, getCategories } = useRepoStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [category, setCategory] = useState<string>(props.category);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  // A repo always needs to have at least one category
  const deleteEnabled = getCategories().length > 1;

  const onEdit = () => setEditing(true);

  const onConfirm = async () => {
    setLoading(true);
    await updateCategory(props.category, category);
    setEditing(false);
    setLoading(false);
  };

  const onCancel = () => {
    setCategory(props.category);
    setEditing(false);
  };

  const onDelete = async () => {
    setLoading(true);
    await deleteCategory(props.category);
    setEditing(false);
    setLoading(false);
  };

  useEffect(() => {
    setCategory(props.category);
  }, [props]);

  return (
    <Tr _last={{ td: { borderBottom: "0px" } }}>
      <Td w="full">
        {isEditing ? (
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
          />
        ) : (
          <Text fontWeight="semibold">{props.category}</Text>
        )}
      </Td>
      <Td>
        <HStack w="full">
          {isEditing ? (
            <HStack w="full">
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

                      {deleteEnabled && (
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
                      )}
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <ConfirmationModal
                title="Delete Category"
                message={
                  <>
                    <Text mb={8}>
                      Do you want to delete{" "}
                      <Text fontWeight="semibold" as="span">
                        {props.category}
                      </Text>
                      ?
                    </Text>
                    <Infobox text="Deleting this category will also delete all translations that are in it!" />
                  </>
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

export default CategoryTableRow;

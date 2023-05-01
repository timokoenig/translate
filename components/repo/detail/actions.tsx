import { useRepoStore } from "@/utils/store/repo/repo-context";
import { Text, Box, HStack } from "@chakra-ui/react";
import CreateTranslationModal from "./modal/create";

const Actions = () => {
  const { translationFile } = useRepoStore();
  const keyCount = Object.keys(translationFile?.data ?? {}).length;

  const onAdd = () => {
    console.log("test");
  };

  return (
    <Box p={8}>
      <HStack>
        <Text>
          <Text as="span" fontWeight="semibold">
            {keyCount}
          </Text>{" "}
          {keyCount > 1 ? "Translations" : "Translation"}
        </Text>
        <Box flex={1} />
        <CreateTranslationModal />
      </HStack>
    </Box>
  );
};

export default Actions;

import { useRepoStore } from "@/utils/store/repo/repo-context";
import { Box, HStack, Select } from "@chakra-ui/react";
import CreateTranslationModal from "./modal/create";

const Actions = () => {
  const { getCategories, getLanguages } = useRepoStore();

  return (
    <Box p={8}>
      <HStack gap={4}>
        <Select value={-1} w="auto">
          <option value={-1}>All Categories</option>
          {getCategories().map((obj, index) => (
            <option key={index} value={index}>
              {obj}
            </option>
          ))}
        </Select>

        <Select value={-1} w="auto">
          <option value={-1}>All Languages</option>
          {getLanguages().map((obj, index) => (
            <option key={index} value={index}>
              {`${obj.emoji} ${obj.name}`}
            </option>
          ))}
        </Select>
        <Box flex={1} />
        <CreateTranslationModal />
      </HStack>
    </Box>
  );
};

export default Actions;

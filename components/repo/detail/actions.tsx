import { useRepoStore } from "@/utils/store/repo/repo-context";
import { Box, HStack, Select, Text } from "@chakra-ui/react";
import CreateTranslationModal from "./modal/create";

type Props = {
  translationCount: number;
};

const Actions = (props: Props) => {
  const { getCategories, getLanguages, filter, setFilter } = useRepoStore();
  const languages = getLanguages();
  const categories = getCategories();

  const onChangeCategory = (value: number): void => {
    if (value == -1) {
      setFilter({ ...filter, category: null });
      return;
    }
    const category = categories[value];
    setFilter({ ...filter, category });
  };

  const onChangeLanguage = (value: number): void => {
    if (value == -1) {
      setFilter({ ...filter, language: null });
      return;
    }
    const language = languages[value].code;
    setFilter({ ...filter, language });
  };

  return (
    <Box p={8}>
      <HStack gap={4}>
        <Select
          value={categories.findIndex((obj) => obj == filter.category)}
          onChange={(e) => onChangeCategory(Number(e.target.value))}
          w="auto"
        >
          <option value={-1}>All Categories</option>
          {getCategories().map((obj, index) => (
            <option key={index} value={index}>
              {obj}
            </option>
          ))}
        </Select>

        <Select
          value={languages.findIndex((obj) => obj.code == filter.language)}
          onChange={(e) => onChangeLanguage(Number(e.target.value))}
          w="auto"
        >
          <option value={-1}>All Languages</option>
          {getLanguages().map((obj, index) => (
            <option key={index} value={index}>
              {`${obj.emoji} ${obj.name}`}
            </option>
          ))}
        </Select>

        <Text>
          {props.translationCount}{" "}
          {props.translationCount == 1 ? "Translation" : "Translations"}
        </Text>
        <Box flex={1} />
        <CreateTranslationModal />
      </HStack>
    </Box>
  );
};

export default Actions;

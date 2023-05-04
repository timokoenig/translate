import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Text,
  Center,
} from "@chakra-ui/react";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import RepositoryDetailListRow from "./table-row";
import Actions from "./actions";

type Props = {
  search: string;
};

const RepositoryDetailList = (props: Props) => {
  const { getTranslationGroups, filter } = useRepoStore();
  const filteredTranslationGroup = getTranslationGroups()
    // filter based on addtional filters
    .filter((obj) => {
      if (filter.category && filter.category != obj.category) {
        // translation is not in category
        return false;
      }
      if (
        filter.language &&
        obj.translations.findIndex(
          (translation) => translation.lang == filter.language
        ) == -1
      ) {
        // translation is not available in given language
        return false;
      }
      return true;
    })
    // filter translations that have missing translations (if filter is enabled)
    .filter((obj) => {
      if (!filter.missingTranslations) return true;
      return (
        obj.translations.findIndex(
          (translation) =>
            translation.value.length == 0 &&
            (filter.language == null
              ? true
              : translation.lang == filter.language)
        ) != -1
      );
    })
    // filter based on users search query
    .filter((obj) => {
      if (props.search == "") return true;
      return (
        obj.translations.findIndex(
          (translation) =>
            translation.key.includes(props.search) ||
            translation.value.includes(props.search)
        ) != -1
      );
    })
    // sort by key name
    .sort((a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0));

  return (
    <>
      <Actions translationCount={filteredTranslationGroup.length} />
      <TableContainer margin={0} padding={2}>
        <Table variant="simple" margin={0}>
          <Thead>
            <Tr>
              <Th>Key</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTranslationGroup.map((group, index) => (
              <RepositoryDetailListRow key={index} translationGroup={group} />
            ))}
          </Tbody>
        </Table>
        {filteredTranslationGroup.length == 0 && (
          <Center p={8}>
            <Text>No Translations</Text>
          </Center>
        )}
      </TableContainer>
    </>
  );
};

export default RepositoryDetailList;

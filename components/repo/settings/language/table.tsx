import {
  Table,
  TableContainer,
  Tbody,
  Heading,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import AddLanguageModal from "./modal/add";
import LanguageTableRow from "./table-row";

const LanguageTable = () => {
  const { getLanguages } = useRepoStore();
  const sortedLanguages = getLanguages()
    // sort by name
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

  return (
    <>
      <Box p={8} pb={0}>
        <HStack gap={4}>
          <Heading as="h2" size="md">
            Languages
          </Heading>
          <Box flex={1} />
          <AddLanguageModal />
        </HStack>
      </Box>
      <TableContainer m={0} mb={8} p={2}>
        <Table variant="simple" margin={0}>
          <Tbody>
            {sortedLanguages.map((lang, index) => (
              <LanguageTableRow key={index} language={lang} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LanguageTable;

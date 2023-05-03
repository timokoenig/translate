import {
  Table,
  TableContainer,
  Tbody,
  Heading,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import CategoryTableRow from "./table-row";
import CreateCategoryModal from "./modal/create";

const CategoryTable = () => {
  const { getCategories } = useRepoStore();
  const sortedCategories = getCategories()
    // sort by name
    .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

  return (
    <>
      <Box p={8} pb={0}>
        <HStack gap={4}>
          <Heading as="h2" size="md">
            Categories
          </Heading>
          <Box flex={1} />
          <CreateCategoryModal />
        </HStack>
      </Box>
      <TableContainer m={0} mb={8} p={2}>
        <Table variant="simple" margin={0}>
          <Tbody>
            {sortedCategories.map((cat, index) => (
              <CategoryTableRow key={index} category={cat} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategoryTable;

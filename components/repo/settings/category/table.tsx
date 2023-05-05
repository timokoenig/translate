import { useRepoStore } from '@/utils/store/repo/repo-context'
import { Box, HStack, Heading, Table, TableContainer, Tbody } from '@chakra-ui/react'
import CreateCategoryModal from './modal/create'
import CategoryTableRow from './table-row'

const CategoryTable = () => {
  const { getCategories } = useRepoStore()
  const sortedCategories = getCategories()
    // sort by name
    .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))

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
  )
}

export default CategoryTable

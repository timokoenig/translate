import { useRepoStore } from '@/utils/store/repo/repo-context'
import { Box, HStack, Heading, Table, TableContainer, Tbody } from '@chakra-ui/react'
import AddLanguageModal from './modal/add'
import LanguageTableRow from './table-row'

const LanguageTable = () => {
  const { currentRepo } = useRepoStore()
  const sortedLanguages = currentRepo.languages.sort((a, b) =>
    a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  ) // sort by name

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
  )
}

export default LanguageTable

import { useRepoStore } from '@/utils/store/repo/repo-context'
import { Box, HStack, Heading, Table } from '@chakra-ui/react'
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
      <Box m={0} mb={8} p={2} overflowX="auto">
        <Table.Root variant='line' m={0}>
          <Table.Body>
            {sortedLanguages.map((lang, idx) => (
              <LanguageTableRow key={idx} language={lang} />
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </>
  )
}

export default LanguageTable

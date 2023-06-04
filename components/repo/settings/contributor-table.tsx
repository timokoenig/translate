import { useRepoStore } from '@/utils/store/repo/repo-context'
import { Box, Heading, VStack } from '@chakra-ui/react'
import ContributorTableRow from './contributor-table-row'

const ContributorTable = () => {
  const { currentRepo } = useRepoStore()

  return (
    <Box>
      <Heading as="h2" size="md" px={8} pt={8}>
        {currentRepo.contributors.length}{' '}
        {currentRepo.contributors.length > 1 ? 'Contributors' : 'Contributor'}
      </Heading>
      <VStack w="full" p={8}>
        {currentRepo.contributors.map((user, index) => (
          <ContributorTableRow key={index} user={user} />
        ))}
      </VStack>
    </Box>
  )
}

export default ContributorTable

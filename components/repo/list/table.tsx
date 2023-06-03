import { useAppStore } from '@/utils/store/app/app-context'
import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import RepositoryListRow from './table-row'

type Props = {
  search: string
}

const RepositoryList = (props: Props) => {
  const { remoteRepositories, localRepositories } = useAppStore()
  const filteredRepos = remoteRepositories
    // sort by name
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
    // show added repositories on top
    .sort((a, b) =>
      (
        localRepositories.findIndex(obj => obj.id == a.id) != -1 &&
        localRepositories.findIndex(obj => obj.id == b.id) == -1
          ? 1
          : localRepositories.findIndex(obj => obj.id == a.id) == -1 &&
            localRepositories.findIndex(obj => obj.id == b.id) != -1
      )
        ? -1
        : 0
    )
    // filter based on users search query
    .filter(obj => {
      if (props.search == '') return true
      return obj.full_name.includes(props.search)
    })

  return (
    <TableContainer margin={0} whiteSpace="normal">
      <Table variant="simple" layout={{ base: 'fixed', md: 'auto' }}>
        <Thead display={{ base: 'none', md: 'table-header-group' }}>
          <Tr>
            <Th>Repository</Th>
            <Th>Visibility</Th>
            <Th>Last Updated</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {filteredRepos.map((repo, index) => (
            <RepositoryListRow key={index} repo={repo} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RepositoryList

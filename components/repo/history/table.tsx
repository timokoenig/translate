/* eslint-disable react-hooks/exhaustive-deps */
import LoadingIndicatorFull from '@/components/global/loading-indicator-full'
import { Commit } from '@/utils/models'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import RepositoryHistoryTableRow from './table-row'

const RepositoryHistoryTable = () => {
  const { fetchHistory } = useRepoStore()
  const [commits, setCommits] = useState<Commit[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const sortedCommits = commits
    // sort by date
    .sort((a, b) =>
      a.committer.date > b.committer.date ? -1 : a.committer.date < b.committer.date ? 1 : 0
    )

  useEffect(() => {
    ;(async () => {
      const res = await fetchHistory()
      setCommits(res)
      setLoading(false)
    })()
  }, [])

  if (isLoading) {
    return <LoadingIndicatorFull />
  }

  return (
    <TableContainer margin={0} padding={2}>
      <Table variant="simple" margin={0}>
        <Thead>
          <Tr>
            <Th>Message</Th>
            <Th>Date</Th>
            <Th>SHA</Th>
            <Th>Change</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedCommits.map((commit, index) => (
            <RepositoryHistoryTableRow key={index} commit={commit} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RepositoryHistoryTable

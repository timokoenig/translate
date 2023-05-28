import { TranslationGroup } from '@/utils/models'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import { Center, Table, TableContainer, Tbody, Text, Th, Thead, Tr } from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import Actions from '../actions'
import ColumnActions from './column/actions/cell'
import ColumnKeyCell from './column/key/cell'
import ColumnKeyHeader from './column/key/header'
import ColumnValueCell from './column/value/cell'
import ColumnValueHeader from './column/value/header'
import TableRow from './row'

type Props = {
  search: string
}

const RepositoryDetailList = (props: Props) => {
  const { translationFiles, getTranslationGroups, filter } = useRepoStore()

  const filteredTranslationGroup = useMemo(
    () =>
      getTranslationGroups()
        // filter based on addtional filters
        .filter(obj => {
          if (filter.category && filter.category != obj.category) {
            // translation is not in category
            return false
          }
          if (
            filter.language &&
            obj.translations.findIndex(translation => translation.lang == filter.language) == -1
          ) {
            // translation is not available in given language
            return false
          }
          return true
        })
        // filter translations that have missing translations (if filter is enabled)
        .filter(obj => {
          if (!filter.missingTranslations) return true
          return (
            obj.translations.findIndex(
              translation =>
                translation.value.length == 0 &&
                (filter.language == null ? true : translation.lang == filter.language)
            ) != -1
          )
        })
        // filter based on users search query
        .filter(obj => {
          if (props.search == '') return true
          return (
            obj.translations.findIndex(
              translation =>
                translation.key.includes(props.search) || translation.value.includes(props.search)
            ) != -1
          )
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translationFiles, filter, props]
  )

  // Get the count of all visible translations
  const getCount = (group: TranslationGroup): number => {
    if (group.children.length == 0) {
      return 1
    }
    return group.children.map(getCount).reduce((a, b) => a + b, 0)
  }
  const filteredTranslationGroupCount = filteredTranslationGroup
    .map(getCount)
    .reduce((a, b) => a + b, 0)

  const columns: ColumnDef<TranslationGroup>[] = [
    {
      id: 'key',
      accessorFn: row => row,
      header: data => (
        <ColumnKeyHeader
          data={data}
          filteredTranslationGroupCount={filteredTranslationGroupCount}
        />
      ),
      cell: data => <ColumnKeyCell data={data} />,
    },
    {
      id: 'value',
      accessorFn: row => row,
      header: () => <ColumnValueHeader />,
      cell: data => <ColumnValueCell data={data} />,
    },
    {
      id: 'action',
      accessorFn: row => row,
      header: '',
      cell: data => <ColumnActions data={data} />,
    },
  ]

  const table = useReactTable({
    data: filteredTranslationGroup,
    columns,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <>
      <Actions />
      <TableContainer margin={0}>
        <Table variant="simple" margin={0}>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data={row} />
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
  )
}

export default RepositoryDetailList

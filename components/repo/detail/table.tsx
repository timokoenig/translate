/* eslint-disable react-hooks/exhaustive-deps */
import useColorMode from '@/utils/color-mode'
import { Filter, Translation, TranslationGroup } from '@/utils/models'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import {
  Box,
  Center,
  HStack,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import Actions from './actions'

const translationFilter = (translation: Translation, filter: Filter): boolean => {
  if (filter.language && translation.lang != filter.language) {
    return false
  }
  return true
}

const translationSorter = (a: Translation, b: Translation) =>
  a.lang > b.lang ? 1 : a.lang < b.lang ? -1 : 0

type Props = {
  search: string
}

const RepositoryDetailList = (props: Props) => {
  const { isLightMode } = useColorMode()
  const { translationFiles, getTranslationGroups, filter, getLanguages } = useRepoStore()

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
        })
        // sort by key name
        .sort((a, b) => (a.key > b.key ? 1 : a.key < b.key ? -1 : 0)),
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

  const columns = useMemo<ColumnDef<TranslationGroup>[]>(
    () => [
      {
        id: 'key',
        accessorFn: row => row,
        header: ({ table }) => (
          <HStack>
            <IconButton
              size="sm"
              aria-label="Expand All Rows"
              variant="ghost"
              icon={table.getIsAllRowsExpanded() ? <FiChevronDown /> : <FiChevronRight />}
              onClick={() => table.toggleAllRowsExpanded()}
            />
            <Text>
              Key{' '}
              <Text as="span" fontWeight="normal" fontSize={12}>
                (
                <Text as="span">
                  {filteredTranslationGroupCount}{' '}
                  {filteredTranslationGroupCount == 1 ? 'Translation' : 'Translations'}
                </Text>
                )
              </Text>
            </Text>
          </HStack>
        ),
        cell: ({ row, getValue }) => {
          const group = getValue() as TranslationGroup
          const translationCount = getCount(group)
          return (
            <HStack pl={`${row.depth * 2}rem`}>
              {row.getCanExpand() ? (
                <IconButton
                  size="sm"
                  aria-label="Expand Row"
                  variant="ghost"
                  icon={row.getIsExpanded() ? <FiChevronDown /> : <FiChevronRight />}
                  onClick={() => row.toggleExpanded()}
                />
              ) : (
                <Box w={8} />
              )}
              {row.getCanExpand() ? (
                <Text fontWeight="semibold">
                  {group.key}{' '}
                  <Text as="span" fontWeight="normal" fontSize={12}>
                    (
                    <Text as="span">
                      {translationCount} {translationCount == 1 ? 'Translation' : 'Translations'}
                    </Text>
                    )
                  </Text>
                </Text>
              ) : (
                <Text fontWeight="semibold">{group.key}</Text>
              )}
            </HStack>
          )
        },
      },
      {
        id: 'value',
        accessorFn: row => row,
        cell: data => {
          const group = data.getValue() as TranslationGroup
          if (group.children.length > 0) {
            return <></>
          }
          return (
            <VStack w="full">
              {group.translations
                .filter(obj => translationFilter(obj, filter))
                .sort(translationSorter)
                .map((obj, index) => (
                  <HStack key={index} w="full">
                    <Text whiteSpace="initial">
                      {getLanguages().find(lang => lang.code == obj.lang)?.emoji}
                    </Text>
                    <Text whiteSpace="initial" w="full">
                      {obj.value}
                    </Text>
                  </HStack>
                ))}
            </VStack>
          )
        },
        header: () => <Text>Value</Text>,
      },
    ],
    [getLanguages, filter]
  )

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
      <TableContainer margin={0} padding={2}>
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
              <Tr
                key={row.id}
                backgroundColor={
                  isLightMode ? `gray.${0 + row.depth * 100}` : `gray.${800 - row.depth * 100}`
                }
              >
                {row.getVisibleCells().map(cell => (
                  <Td
                    key={cell.id}
                    borderBottomColor={
                      isLightMode
                        ? `gray.${100 + row.depth * 100}`
                        : `gray.${700 - row.depth * 100}`
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
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

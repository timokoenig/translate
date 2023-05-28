import { TranslationGroup } from '@/utils/models'
import { Box, HStack, IconButton } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

// Get the count of all visible translations
const getCount = (group: TranslationGroup): number => {
  if (group.children.length == 0) {
    return 1
  }
  return group.children.map(getCount).reduce((a, b) => a + b, 0)
}

type Props = {
  data: CellContext<TranslationGroup, unknown>
  children: JSX.Element
}
const ColumnKeyContainer = (props: Props) => (
  <HStack pl={`${props.data.row.depth * 2}rem`}>
    {props.data.row.getCanExpand() ? (
      <IconButton
        size="sm"
        aria-label="Expand Row"
        variant="ghost"
        icon={props.data.row.getIsExpanded() ? <FiChevronDown /> : <FiChevronRight />}
        onClick={() => props.data.row.toggleExpanded()}
      />
    ) : (
      <Box w={8} />
    )}
    {props.children}
  </HStack>
)

export default ColumnKeyContainer

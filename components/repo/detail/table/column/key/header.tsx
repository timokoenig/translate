import { TranslationGroup } from '@/utils/models'
import { HStack, IconButton, Text } from '@chakra-ui/react'
import { HeaderContext } from '@tanstack/react-table'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

type Props = {
  data: HeaderContext<TranslationGroup, unknown>
  filteredTranslationGroupCount: number
}

const ColumnKeyHeader = (props: Props) => (
  <HStack>
    <IconButton
      size="sm"
      aria-label="Expand All Rows"
      variant="ghost"
      icon={props.data.table.getIsAllRowsExpanded() ? <FiChevronDown /> : <FiChevronRight />}
      onClick={() => props.data.table.toggleAllRowsExpanded()}
    />
    <Text>
      Key{' '}
      <Text as="span" fontWeight="normal" fontSize={12}>
        (
        <Text as="span">
          {props.filteredTranslationGroupCount}{' '}
          {props.filteredTranslationGroupCount == 1 ? 'Translation' : 'Translations'}
        </Text>
        )
      </Text>
    </Text>
  </HStack>
)

export default ColumnKeyHeader

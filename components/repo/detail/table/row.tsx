import useColorMode from '@/utils/color-mode'
import { TranslationGroup } from '@/utils/models'
import TranslationStoreProvider from '@/utils/store/translation/translation-provider'
import { Td, Tr } from '@chakra-ui/react'
import { Row, flexRender } from '@tanstack/react-table'

type Props = {
  data: Row<TranslationGroup>
}

const TableRow = (props: Props) => {
  const { isLightMode } = useColorMode()

  return (
    <TranslationStoreProvider>
      <Tr
        backgroundColor={
          isLightMode
            ? `gray.${0 + props.data.depth * 100}`
            : `gray.${800 - props.data.depth * 100}`
        }
        _hover={{
          '.tr-actions': {
            display: 'flex',
          },
        }}
      >
        {props.data.getVisibleCells().map(cell => (
          <Td
            key={cell.id}
            width={cell.column.id == 'value' ? '100%' : undefined}
            height="80px"
            borderBottomColor={
              isLightMode
                ? `gray.${100 + props.data.depth * 100}`
                : `gray.${700 - props.data.depth * 100}`
            }
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        ))}
      </Tr>
    </TranslationStoreProvider>
  )
}

export default TableRow

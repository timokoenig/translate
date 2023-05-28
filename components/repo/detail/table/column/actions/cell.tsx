import ConfirmationModal from '@/components/global/modal/confirmation'
import { TranslationGroup } from '@/utils/models'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import { useTranslationStore } from '@/utils/store/translation/translation-context'
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'

type Props = {
  data: CellContext<TranslationGroup, unknown>
}

const ColumnActions = (props: Props) => {
  const { deleteTranslationGroup, updateTranslationGroup } = useRepoStore()
  const { selectedTranslationGroup, setSelectedTranslationGroup, isLoading, setLoading } =
    useTranslationStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const translationGroup = props.data.getValue() as TranslationGroup

  const onDelete = async () => {
    setLoading(true)
    await deleteTranslationGroup(translationGroup)
    setLoading(false)
  }

  const onSave = async () => {
    if (!selectedTranslationGroup) return
    setLoading(true)
    await updateTranslationGroup(translationGroup, selectedTranslationGroup)
    setSelectedTranslationGroup(null)
    setLoading(false)
  }

  const onCancel = async () => {
    setSelectedTranslationGroup(null)
  }

  if (
    selectedTranslationGroup &&
    selectedTranslationGroup.keyPath.join('.') == translationGroup.keyPath.join('.')
  ) {
    return (
      <HStack>
        <IconButton
          size="sm"
          aria-label="Confirm Button"
          icon={<CheckIcon />}
          variant="outline"
          colorScheme="green"
          onClick={async e => {
            e.preventDefault()
            onSave()
          }}
          isLoading={isLoading}
        />
        <IconButton
          size="sm"
          aria-label="Close Button"
          icon={<CloseIcon />}
          variant="outline"
          colorScheme="red"
          onClick={e => {
            e.preventDefault()
            onCancel()
          }}
          isLoading={isLoading}
        />
      </HStack>
    )
  }

  return (
    <HStack className="tr-actions" display={isLoading ? 'block' : 'none'}>
      <IconButton
        aria-label="Edit"
        icon={<EditIcon />}
        variant="ghost"
        isLoading={isLoading}
        onClick={e => {
          e.preventDefault()
          setSelectedTranslationGroup(translationGroup)
        }}
      />
      <IconButton
        aria-label="Delete"
        icon={<DeleteIcon />}
        variant="ghost"
        colorScheme="red"
        isLoading={isLoading}
        onClick={e => {
          e.preventDefault()
          onOpen()
        }}
      />
      <ConfirmationModal
        title="Delete Translation"
        message={(() => {
          if (translationGroup.children.length > 0) {
            return (
              <Text>
                Do you want to delete{' '}
                <Text fontWeight="semibold" as="span">
                  {translationGroup.key}
                </Text>{' '}
                and all its children?
              </Text>
            )
          }
          return (
            <Text>
              Do you want to delete{' '}
              <Text fontWeight="semibold" as="span">
                {translationGroup.key}
              </Text>
              ?
            </Text>
          )
        })()}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onConfirm={onDelete}
      />
    </HStack>
  )
}

export default ColumnActions

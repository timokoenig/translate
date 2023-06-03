import { Repository } from '@/utils/models'
import { useAppStore } from '@/utils/store/app/app-context'
import { Box, Button, Tag, Td, Text, Tr, VStack, useBreakpoint } from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import { FiPlus } from 'react-icons/fi'

type Props = {
  repo: Repository
}

const RepositoryListRow = (props: Props) => {
  const { localRepositories, setLocalRepositories } = useAppStore()
  const breakpoint = useBreakpoint()
  const router = useRouter()

  // Check if user has added this repository already
  const isAdded = localRepositories.findIndex(obj => obj.id == props.repo.id) != -1

  const onAdd = () => {
    setLocalRepositories([...localRepositories, props.repo])
    if (breakpoint == 'base') {
      // In case of mobile layout, redirect the user directly to the repo
      router.push(`/repo/${props.repo.id}`)
    }
  }

  const VisibilityTag = () => {
    if (props.repo.private) {
      return (
        <Tag colorScheme="red" size="sm">
          Private
        </Tag>
      )
    }
    return (
      <Tag colorScheme="green" size="sm">
        Public
      </Tag>
    )
  }

  const Actions = () => {
    if (isAdded) {
      return (
        <Button colorScheme="green" variant="ghost" onClick={() => {}} isDisabled>
          Added
        </Button>
      )
    }
    return (
      <Button leftIcon={<FiPlus />} variant="primary" onClick={onAdd}>
        Add
      </Button>
    )
  }

  return (
    <Tr>
      <Td>
        <VStack alignItems="left">
          <Text>
            {props.repo.owner.login}/<strong>{props.repo.name}</strong>
          </Text>
          <Box display={{ base: 'block', md: 'none' }}>
            <VisibilityTag />
          </Box>
          <Text whiteSpace="normal">{props.repo.description}</Text>
          <Box display={{ base: 'block', md: 'none' }} textAlign="right" pt={4}>
            <Actions />
          </Box>
        </VStack>
      </Td>

      <Td display={{ base: 'none', md: 'table-cell' }}>
        <VisibilityTag />
      </Td>

      <Td display={{ base: 'none', md: 'table-cell' }}>
        {moment(props.repo.pushed_at).format('DD/MM/YYYY HH:mm')}
      </Td>

      <Td textAlign="right" display={{ base: 'none', md: 'table-cell' }}>
        <Actions />
      </Td>
    </Tr>
  )
}

export default RepositoryListRow

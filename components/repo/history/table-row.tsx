import { Commit } from '@/utils/models'
import { Avatar, Box, HStack, Heading, Td, Text, Tr, VStack } from '@chakra-ui/react'

type Props = {
  commit: Commit
}

const RepositoryHistoryTableRow = (props: Props) => {
  const lines: string[] = props.commit.message.split('\n')
  const title: string = lines.shift()?.replace('[Translate]', '').trim() ?? ''
  const description: string[] = lines.length > 0 ? lines : []

  const CommitContent = () => (
    <VStack alignItems="left">
      <Text fontWeight="semibold">{title}</Text>
      {description.map((obj, index) => (
        <Text
          fontWeight={['Added', 'Modified', 'Deleted'].includes(obj) ? 'semibold' : 'normal'}
          key={index}
        >
          {obj}
        </Text>
      ))}
    </VStack>
  )

  return (
    <Tr>
      <Td>
        <VStack alignItems="left" gap={4}>
          <HStack>
            <Avatar
              size={{ base: 'sm', md: 'md' }}
              name={props.commit.committer.name}
              src={props.commit.committer.avatar_url}
            />
            <VStack alignItems="left">
              <Heading as="h3" size="s">
                {props.commit.committer.name}
              </Heading>
              <Text as="span" fontSize={14} display={{ base: 'block', md: 'none' }}>
                {props.commit.committer.date.format('DD/MM/YYYY HH:mm')}
              </Text>
            </VStack>
          </HStack>
          <Box display={{ base: 'block', md: 'none' }}>
            <CommitContent />
          </Box>
        </VStack>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>
        {props.commit.committer.date.format('DD/MM/YYYY HH:mm')}
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>{props.commit.sha.substring(0, 10)}</Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>
        <CommitContent />
      </Td>
    </Tr>
  )
}

export default RepositoryHistoryTableRow

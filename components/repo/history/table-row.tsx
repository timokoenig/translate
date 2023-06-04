import { Commit } from '@/utils/models'
import { Avatar, HStack, Heading, Td, Text, Tr, VStack } from '@chakra-ui/react'

type Props = {
  commit: Commit
}

const RepositoryHistoryTableRow = (props: Props) => {
  const lines: string[] = props.commit.message.split('\n')
  const title: string = lines.shift()?.replace('[Translate]', '').trim() ?? ''
  const description: string[] = lines.length > 0 ? lines : []
  return (
    <Tr>
      <Td>
        <HStack>
          <Avatar
            size="md"
            name={props.commit.committer.name}
            src={props.commit.committer.avatar_url}
          />
          <Heading as="h3" size="s">
            {props.commit.committer.name}
          </Heading>
        </HStack>
      </Td>
      <Td>{props.commit.committer.date.format('DD/MM/YYYY HH:mm')}</Td>
      <Td>{props.commit.sha.substring(0, 10)}</Td>
      <Td>
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
      </Td>
    </Tr>
  )
}

export default RepositoryHistoryTableRow

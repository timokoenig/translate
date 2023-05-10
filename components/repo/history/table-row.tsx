import { Commit } from '@/utils/models'
import { Avatar, HStack, Heading, Td, Text, Tr, useColorModeValue } from '@chakra-ui/react'
import jsonDiff from 'json-diff'
import parse from 'parse-diff'

const ChangeDiff = (props: { changes: parse.Change[] }): JSX.Element => {
  const textColor = useColorModeValue('gray.700', 'gray.300')
  const filteredChanges = props.changes.filter(
    obj => !obj.content.includes('No newline at end of file')
  )
  const addition = filteredChanges.find(obj => obj.type == 'add')?.content.substring(1)
  const deletion = filteredChanges.find(obj => obj.type == 'del')?.content.substring(1)

  if (!addition || !deletion) return <></>

  const diff = jsonDiff
    .diffString(JSON.parse(deletion), JSON.parse(addition))
    .replace('{', '')
    .replace('}', '')
    .trim()

  return (
    <Text fontSize={14} color={textColor}>
      <pre>{diff}</pre>
    </Text>
  )
}

type Props = {
  commit: Commit
}

const RepositoryHistoryTableRow = (props: Props) => {
  const patchDiff = parse(props.commit.patch)

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
        <Text fontWeight="semibold" mb={4}>
          {props.commit.message.replace('[Translate]', '').trim()}
        </Text>
        {patchDiff.length > 0 && patchDiff[0].chunks.length > 0 && (
          <ChangeDiff changes={patchDiff[0].chunks[0].changes} />
        )}
      </Td>
    </Tr>
  )
}

export default RepositoryHistoryTableRow

import { User } from '@/utils/models'
import { Avatar, HStack, Heading, Text } from '@chakra-ui/react'

type Props = {
  user: User
}

const ContributorTableRow = (props: Props) => {
  return (
    <HStack gap={14} w="full">
      <HStack>
        <Avatar.Root size="md">
          <Avatar.Fallback name={props.user.login} />
          {/* <AvatarImage src={props.user.avatar_url} /> */}
        </Avatar.Root>
        <Heading as="h3" size="sm">
          {props.user.login}
        </Heading>
      </HStack>
      <Text>{props.user.contributions} contributions</Text>
    </HStack>
  )
}

export default ContributorTableRow

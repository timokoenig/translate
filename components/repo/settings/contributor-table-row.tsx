import { User } from "@/utils/models";
import { Avatar, Text, HStack, Heading } from "@chakra-ui/react";

type Props = {
  user: User;
};

const ContributorTableRow = (props: Props) => {
  return (
    <HStack gap={14} w="full">
      <HStack>
        <Avatar size="sm" name={props.user.login} src={props.user.avatar_url} />
        <Heading as="h3" size="s">
          {props.user.login}
        </Heading>
      </HStack>
      <Text>{props.user.contributions} contributions</Text>
    </HStack>
  );
};

export default ContributorTableRow;

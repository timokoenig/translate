import { Commit } from "@/utils/models";
import {
  Td,
  Tr,
  HStack,
  Avatar,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";
import parse from "parse-diff";

type Props = {
  commit: Commit;
};

const RepositoryHistoryTableRow = (props: Props) => {
  const patchDiff = parse(props.commit.patch);

  const renderDiff = (diff: parse.File): JSX.Element => (
    <VStack>
      {diff.chunks.map((chunk, chunkIndex) => (
        <VStack key={chunkIndex}>
          {chunk.changes.map((change, changeIndex) => (
            <HStack gap={4} key={changeIndex}>
              <Text fontWeight="semibold">{change.type.toUpperCase()}</Text>
              <Text>{change.content}</Text>
            </HStack>
          ))}
        </VStack>
      ))}
    </VStack>
  );

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
      <Td>{props.commit.committer.date.format("DD/MM/YYYY HH:mm")}</Td>
      <Td>{props.commit.sha.substring(0, 10)}</Td>
      <Td>
        <div>{patchDiff.map(renderDiff)}</div>
      </Td>
    </Tr>
  );
};

export default RepositoryHistoryTableRow;

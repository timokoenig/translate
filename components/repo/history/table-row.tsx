import { Commit } from "@/utils/models";
import { Td, Tr, HStack, Avatar, Heading, Text } from "@chakra-ui/react";
import parse from "parse-diff";
import jsonDiff from "json-diff";

const ChangeDiff = (props: { changes: parse.Change[] }): JSX.Element => {
  const filteredChanges = props.changes.filter(
    (obj) => !obj.content.includes("No newline at end of file")
  );
  const addition = filteredChanges
    .find((obj) => obj.type == "add")
    ?.content.substring(1);
  const deletion = filteredChanges
    .find((obj) => obj.type == "del")
    ?.content.substring(1);

  if (!addition || !deletion) return <></>;

  const diff = jsonDiff.diffString(JSON.parse(deletion), JSON.parse(addition));

  return <Text>{diff}</Text>;
};

type Props = {
  commit: Commit;
};

const RepositoryHistoryTableRow = (props: Props) => {
  const patchDiff = parse(props.commit.patch);

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
        {patchDiff.length > 0 && patchDiff[0].chunks.length > 0 && (
          <ChangeDiff changes={patchDiff[0].chunks[0].changes} />
        )}
      </Td>
    </Tr>
  );
};

export default RepositoryHistoryTableRow;

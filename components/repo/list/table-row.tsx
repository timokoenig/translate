import { Repository } from "@/utils/models";
import { useAppStore } from "@/utils/store/app/app-context";
import { Button, Td, Tr, Tag } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import moment from "moment";

type Props = {
  repo: Repository;
};

const RepositoryListRow = (props: Props) => {
  const { localRepositories, setLocalRepositories } = useAppStore();

  // Check if user has added this repository already
  const isAdded =
    localRepositories.findIndex((obj) => obj.id == props.repo.id) != -1;

  const onAdd = () => {
    setLocalRepositories([...localRepositories, props.repo]);
  };

  return (
    <Tr>
      <Td>
        {props.repo.owner.login}/<strong>{props.repo.name}</strong>
      </Td>
      <Td>
        {props.repo.private ? (
          <Tag colorScheme="red" size="sm" ml={2}>
            Private
          </Tag>
        ) : (
          <Tag colorScheme="green" size="sm" ml={2}>
            Public
          </Tag>
        )}
      </Td>
      <Td>{moment(props.repo.pushed_at).format("DD/MM/YYYY HH:mm")}</Td>
      <Td textAlign="right">
        {isAdded ? (
          <Button
            colorScheme="green"
            variant="ghost"
            onClick={() => {}}
            isDisabled
          >
            Added
          </Button>
        ) : (
          <Button
            leftIcon={<FiPlus />}
            bgGradient="linear(to-r, red.400,pink.400)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, red.500,pink.500)",
            }}
            variant="solid"
            onClick={onAdd}
          >
            Add
          </Button>
        )}
      </Td>
    </Tr>
  );
};

export default RepositoryListRow;

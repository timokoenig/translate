import { useAppStore } from "@/utils/store/app-context";
import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import RepositoryListRow from "./table-row";

type Props = {
  search: string;
};

const RepositoryList = (props: Props) => {
  const { remoteRepositories } = useAppStore();
  const filteredRepos = remoteRepositories
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
    .filter((obj) => {
      if (props.search == "") return true;
      return obj.full_name.includes(props.search);
    });

  return (
    <TableContainer margin={0} padding={2}>
      <Table variant="simple" margin={0}>
        <Thead>
          <Tr>
            <Th>Repository</Th>
            <Th>Visibility</Th>
            <Th>Last Updated</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {filteredRepos.map((repo, index) => (
            <RepositoryListRow key={index} repo={repo} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RepositoryList;

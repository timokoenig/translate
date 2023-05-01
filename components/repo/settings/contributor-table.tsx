import { useAppStore } from "@/utils/store/app/app-context";
import { Heading, Table, TableContainer, Tbody, Box } from "@chakra-ui/react";
import ContributorTableRow from "./contributor-table-row";

const ContributorTable = () => {
  const { remoteRepositories, localRepositories } = useAppStore();
  const filteredRepos = remoteRepositories
    // sort by name
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
    // show added repositories on top
    .sort((a, b) =>
      (
        localRepositories.findIndex((obj) => obj.id == a.id) != -1 &&
        localRepositories.findIndex((obj) => obj.id == b.id) == -1
          ? 1
          : localRepositories.findIndex((obj) => obj.id == a.id) == -1 &&
            localRepositories.findIndex((obj) => obj.id == b.id) != -1
      )
        ? -1
        : 0
    );

  return (
    <Box>
      <Heading as="h2" size="md" px={8} pt={8}>
        Contributors
      </Heading>
      <TableContainer margin={0} padding={2}>
        <Table variant="simple" margin={0}>
          <Tbody>
            {filteredRepos.map((repo, index) => (
              <ContributorTableRow key={index} repo={repo} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContributorTable;

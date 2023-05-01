import { Heading, Box, VStack } from "@chakra-ui/react";
import ContributorTableRow from "./contributor-table-row";
import { useRepoStore } from "@/utils/store/repo/repo-context";

const ContributorTable = () => {
  const { contributors } = useRepoStore();

  return (
    <Box>
      <Heading as="h2" size="md" px={8} pt={8}>
        {contributors.length}{" "}
        {contributors.length > 1 ? "Contributors" : "Contributor"}
      </Heading>
      <VStack w="full" p={8}>
        {contributors.map((user, index) => (
          <ContributorTableRow key={index} user={user} />
        ))}
      </VStack>
    </Box>
  );
};

export default ContributorTable;

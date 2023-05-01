import SearchInput from "@/components/global/search-input";
import { Heading, Text, Box, VStack } from "@chakra-ui/react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

const RepositoryListHeader = (props: Props) => {
  return (
    <VStack gap={4} w="full" align="flex-start" p={8}>
      <SearchInput
        value={props.search}
        onChange={props.setSearch}
        onClear={() => props.setSearch("")}
      />

      <Box mb={10}>
        <Heading size="lg">GitHub Repositories</Heading>
        <Text>
          Select a repository from the list below to use it with{" "}
          <Text
            bgGradient="linear(to-r, red.400,pink.400)"
            bgClip="text"
            fontWeight="bold"
            display="inline"
          >
            Translate
          </Text>
        </Text>
      </Box>
    </VStack>
  );
};

export default RepositoryListHeader;

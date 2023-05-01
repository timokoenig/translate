import SearchInput from "@/components/global/search-input";
import { Repository } from "@/utils/models";
import {
  Heading,
  Box,
  Button,
  VStack,
  AvatarGroup,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

type Props = {
  repo: Repository;
  searchEnabled: boolean;
  search: string;
  setSearch: (value: string) => void;
  showCloseButton?: boolean;
};

const RepositoryDetailHeader = (props: Props) => {
  const router = useRouter();
  return (
    <VStack gap={4} w="full" align="flex-start" p={8}>
      <SearchInput
        value={props.search}
        onChange={props.setSearch}
        onClear={() => props.setSearch("")}
        disabled={!props.searchEnabled}
      />

      <HStack mb={10} w="full">
        <Heading size="lg" fontWeight="normal" flex={1}>
          {props.repo.owner.login}/<strong>{props.repo.name}</strong>
        </Heading>
        <Box pr={5}>
          {props.showCloseButton ?? false ? (
            <Button
              bgGradient="linear(to-r, red.400,pink.400)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, red.500,pink.500)",
              }}
              onClick={() => router.push(`/repo/${props.repo.id}`)}
            >
              Close
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push(`/repo/${props.repo.id}/settings`)}
            >
              Settings
            </Button>
          )}
        </Box>
        <AvatarGroup size="md" max={3}>
          <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
          <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
          <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
          <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
        </AvatarGroup>
      </HStack>
    </VStack>
  );
};

export default RepositoryDetailHeader;

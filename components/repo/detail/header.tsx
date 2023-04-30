import SearchInput from "@/components/global/search-input";
import { Repository } from "@/utils/models";
import {
  Heading,
  Box,
  Button,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  AvatarGroup,
  Avatar,
  HStack,
} from "@chakra-ui/react";

type Props = {
  repo: Repository;
  search: string;
  setSearch: (value: string) => void;
};

const RepositoryDetailHeader = (props: Props) => {
  return (
    <VStack gap={4} w="full" align="flex-start" p={8}>
      <SearchInput
        value={props.search}
        onChange={props.setSearch}
        onClear={() => props.setSearch("")}
      />

      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" color="gray.500">
            Repository
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/repo/${props.repo.id}`} fontWeight="semibold">
            Detail
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <HStack mb={10} w="full">
        <Heading size="lg" fontWeight="normal" flex={1}>
          {props.repo.owner.login}/<strong>{props.repo.name}</strong>
        </Heading>
        <Box pr={5}>
          <Button variant="outline">Settings</Button>
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

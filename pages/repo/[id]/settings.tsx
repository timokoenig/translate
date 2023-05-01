/* eslint-disable react-hooks/exhaustive-deps */
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import HorizontalLine from "@/components/global/horizontal-line";
import RepositoryDetailHeader from "@/components/repo/detail/header";
import { useAppStore } from "@/utils/store/app/app-context";
import { useRouter } from "next/router";
import ContributorTable from "@/components/repo/settings/contributor-table";
import { Button, Box, Heading } from "@chakra-ui/react";
import RepoDetailLayout from "@/components/repo/detail/layout";

type Props = {
  id: number;
};

const RepositoryDetailContent = (props: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const { localRepositories, setLocalRepositories } = useAppStore();
  const repo = localRepositories.find((obj) => obj.id == props.id);

  const onRemoveRepo = () => {
    setLocalRepositories(localRepositories.filter((obj) => obj.id != props.id));
    router.replace("/");
  };

  useEffect(() => {
    if (!repo) {
      router.replace("/");
    }
  }, []);

  if (!repo) {
    return null;
  }

  return (
    <>
      <RepositoryDetailHeader
        repo={repo}
        searchEnabled={false}
        search={search}
        setSearch={setSearch}
        showCloseButton={true}
      />
      <HorizontalLine />
      <ContributorTable />
      <HorizontalLine />
      <Box p={8}>
        <Heading as="h2" size="md" mb={8}>
          Others
        </Heading>
        <Button
          bgGradient="linear(to-r, red.400,pink.400)"
          color="white"
          _hover={{
            bgGradient: "linear(to-r, red.500,pink.500)",
          }}
          variant="solid"
          onClick={onRemoveRepo}
        >
          Remove Repository
        </Button>
      </Box>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: "/signin" },
    };
  }

  return {
    props: {
      id: Number(context.query.id as string),
    },
  };
}

const RepoDetailSettings = (props: Props) => (
  <RepoDetailLayout>
    <RepositoryDetailContent {...props} />
  </RepoDetailLayout>
);

export default RepoDetailSettings;

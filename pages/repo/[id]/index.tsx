/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/components/layout";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import HorizontalLine from "@/components/global/horizontal-line";
import RepositoryDetailHeader from "@/components/repo/detail/header";
import { useAppStore } from "@/utils/store/app/app-context";
import { useRouter } from "next/router";
import RepoStoreProvider from "@/utils/store/repo/repo-provider";

type Props = {
  id: number;
};

const RepositoryDetail = (props: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const { localRepositories } = useAppStore();
  const repo = localRepositories.find((obj) => obj.id == props.id);

  useEffect(() => {
    if (!repo) {
      router.replace("/");
    }
  }, []);

  if (!repo) {
    return null;
  }

  return (
    <RepoStoreProvider>
      <Layout>
        <RepositoryDetailHeader
          repo={repo}
          searchEnabled={true}
          search={search}
          setSearch={setSearch}
        />
        <HorizontalLine />
      </Layout>
    </RepoStoreProvider>
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

export default RepositoryDetail;

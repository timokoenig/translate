/* eslint-disable react-hooks/exhaustive-deps */
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import HorizontalLine from "@/components/global/horizontal-line";
import RepositoryDetailHeader from "@/components/repo/detail/header";
import { useAppStore } from "@/utils/store/app/app-context";
import { useRouter } from "next/router";
import RepoDetailLayout from "@/components/repo/detail/layout";
import { Repository } from "@/utils/models";
import EmptyState from "@/components/repo/detail/empt-state";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import RepositoryDetailList from "@/components/repo/detail/table";

type ContentProps = {
  repo: Repository;
};

const RepositoryDetailContent = (props: ContentProps) => {
  const [search, setSearch] = useState<string>("");
  const { translationFile } = useRepoStore();

  return (
    <>
      <RepositoryDetailHeader
        repo={props.repo}
        searchEnabled={true}
        search={search}
        setSearch={setSearch}
      />
      <HorizontalLine />
      {translationFile ? (
        <RepositoryDetailList search={search} />
      ) : (
        <EmptyState />
      )}
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

type Props = {
  id: number;
};

const RepositoryDetail = (props: Props) => {
  const router = useRouter();
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
    <RepoDetailLayout repo={repo}>
      <RepositoryDetailContent repo={repo} />
    </RepoDetailLayout>
  );
};

export default RepositoryDetail;

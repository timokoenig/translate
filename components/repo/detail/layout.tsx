import LoadingIndicatorFull from "@/components/global/loading-indicator-full";
import Layout from "@/components/layout";
import { useRepoStore } from "@/utils/store/repo/repo-context";
import RepoStoreProvider from "@/utils/store/repo/repo-provider";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const DetailContent = (props: Props) => {
  const { isLoading } = useRepoStore();

  if (isLoading) {
    return <LoadingIndicatorFull />;
  }

  return <>{props.children}</>;
};

const RepoDetailLayout = (props: Props) => {
  return (
    <RepoStoreProvider>
      <Layout>
        <DetailContent {...props} />
      </Layout>
    </RepoStoreProvider>
  );
};

export default RepoDetailLayout;

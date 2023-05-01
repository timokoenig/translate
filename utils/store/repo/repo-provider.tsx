/* eslint-disable react-hooks/exhaustive-deps */
import { RepoStoreContext } from "./repo-context";
import { User } from "../../models";
import { Octokit } from "octokit";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const RepoStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [contributors, setContributors] = useState<User[]>([]);

  // Fetch all repository contributors
  const fetchRepositoryContributors = async (): Promise<void> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    const res: { data: User[] } = await octokit.rest.repos.listContributors({
      owner: "timokoenig",
      repo: "translate",
    });
    setContributors(res.data);
  };

  // Load repository data
  useEffect(() => {
    (async () => {
      await fetchRepositoryContributors();
      setLoading(false);
    })();
  }, []);

  return (
    <RepoStoreContext.Provider
      value={{
        isLoading,
        contributors,
      }}
    >
      {props.children}
    </RepoStoreContext.Provider>
  );
};

export default RepoStoreProvider;

/* eslint-disable react-hooks/exhaustive-deps */
import { AppStoreContext } from "./app-context";
import { Repository } from "../../models";
import { Octokit } from "octokit";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY_REPOSITORIES = "local-repos";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const AppStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [localRepositories, setLocalRepositories] = useState<Repository[]>([]);
  const [remoteRepositories, setRemoteRepositories] = useState<Repository[]>(
    []
  );

  // Get the local repositories from local storage and set it in the app store state
  const getLocalRepositories = (): void => {
    setLocalRepositories(
      JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY_REPOSITORIES) ?? "[]"
      ) as Repository[]
    );
  };
  // save the repositories to the local storage
  const saveLocalRepositories = (repos: Repository[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY_REPOSITORIES, JSON.stringify(repos));
  };
  // Set the given repositories in the app store state and save it to local storage
  const setRepositories = (repos: Repository[]): void => {
    setLocalRepositories(repos);
    saveLocalRepositories(repos);
  };

  // Fetch all github repositories from the current authenticated user
  const fetchGithubRepositories = async (): Promise<Repository[]> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    const res: { data: Repository[] } =
      await octokit.rest.repos.listForAuthenticatedUser();
    return res.data;
  };
  const getRemoteRepositories = async (): Promise<void> => {
    const res = await fetchGithubRepositories();
    setRemoteRepositories(res);
  };

  // Load the initial app data
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      getLocalRepositories();
      await getRemoteRepositories();
      setLoading(false);
    })();
  }, [isAuthenticated]);

  // Check if user is authenticated
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        setAuthenticated(true);
      }
    })();
  });

  return (
    <AppStoreContext.Provider
      value={{
        isLoading,
        localRepositories,
        setLocalRepositories: setRepositories,
        remoteRepositories,
        fetchGithubRepositories,
        setAuthenticated,
      }}
    >
      {props.children}
    </AppStoreContext.Provider>
  );
};

export default AppStoreProvider;
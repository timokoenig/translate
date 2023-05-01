/* eslint-disable react-hooks/exhaustive-deps */
import { RepoStoreContext } from "./repo-context";
import { File, Repository, Translation, User } from "../../models";
import { Octokit } from "octokit";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

const TRANSLATION_FILE = "translation.json";
const GITHUB_API_VERSION = "2022-11-28";

type Props = {
  repo: Repository;
  children: JSX.Element | JSX.Element[];
};

const RepoStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [translationFile, setTranslationFile] = useState<File | null>(null);
  const [contributors, setContributors] = useState<User[]>([]);

  // Fetch all repository contributors
  const fetchRepositoryContributors = async (): Promise<void> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    const res: { data: User[] } = await octokit.rest.repos.listContributors({
      owner: props.repo.owner.login,
      repo: props.repo.name,
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    });
    setContributors(res.data);
  };

  // Fetch repository translation file
  const fetchRepositoryTranslationFile = async (): Promise<void> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    try {
      const res = await octokit.request(
        `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FILE}`,
        {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          headers: {
            "X-GitHub-Api-Version": GITHUB_API_VERSION,
          },
        }
      );
      setTranslationFile({
        name: res.data.name,
        path: res.data.path,
        data: JSON.parse(Buffer.from(res.data.content, "base64").toString()),
        sha: res.data.sha,
      });
    } catch (err: unknown) {
      if (`${err}`.includes("Not Found")) {
        // the translation file does not exist yet; allow the user to create a new one
        return;
      }
      throw err;
    }
  };

  // Update repository translation file
  const updateRepositoryTranslationFile = async (
    data: any,
    sha: string | null
  ): Promise<void> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: props.repo.owner.login,
      repo: props.repo.name,
      path: TRANSLATION_FILE,
      sha: sha ?? undefined,
      message: sha
        ? `Update ${TRANSLATION_FILE}`
        : `Create ${TRANSLATION_FILE}`,
      content: Buffer.from(JSON.stringify(data)).toString("base64"),
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    });
  };

  // Set up new translation repo
  const setupRepository = async (): Promise<void> => {
    await updateRepositoryTranslationFile({ hello_world: "Hello World" }, null);
    await fetchRepositoryTranslationFile();
  };

  // Add new translation
  const addTranslation = async (translation: Translation): Promise<void> => {
    if (!translationFile) throw new Error("No translation file");

    const data = { ...translationFile.data };
    data[translation.key] = translation.value;

    await updateRepositoryTranslationFile(data, translationFile.sha);
    await fetchRepositoryTranslationFile();
  };

  // Update existing translation
  const updateTranslation = async (
    oldTranslation: Translation,
    newTranslation: Translation
  ): Promise<void> => {
    if (!translationFile) throw new Error("No translation file");

    const data = { ...translationFile.data };

    if (oldTranslation.key != newTranslation.key) {
      // Key has changed, first delete old key and then add new one
      delete data[oldTranslation.key];
    }
    data[newTranslation.key] = newTranslation.value;

    await updateRepositoryTranslationFile(data, translationFile.sha);
    await fetchRepositoryTranslationFile();
  };

  // Delete translation
  const deleteTranslation = async (translation: Translation): Promise<void> => {
    if (!translationFile) throw new Error("No translation file");

    const data = { ...translationFile.data };
    delete data[translation.key];

    await updateRepositoryTranslationFile(data, translationFile.sha);
    await fetchRepositoryTranslationFile();
  };

  // Load repository data
  useEffect(() => {
    (async () => {
      await fetchRepositoryContributors();
      await fetchRepositoryTranslationFile();
      setLoading(false);
    })();
  }, []);

  return (
    <RepoStoreContext.Provider
      value={{
        isLoading,
        contributors,
        translationFile,
        setupRepository,
        addTranslation,
        updateTranslation,
        deleteTranslation,
      }}
    >
      {props.children}
    </RepoStoreContext.Provider>
  );
};

export default RepoStoreProvider;
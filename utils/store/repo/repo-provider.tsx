/* eslint-disable react-hooks/exhaustive-deps */
import { RepoStoreContext } from "./repo-context";
import {
  Commit,
  Language,
  Repository,
  Translation,
  TranslationFile,
  TranslationGroup,
  User,
} from "../../models";
import { Octokit } from "octokit";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import moment from "moment";
import TranslationHelper from "@/utils/translation-helper";
import emojiFlags from "@/utils/resources/emoji-flags.json";

const TRANSLATION_FOLDER = "translations";
const GITHUB_API_VERSION = "2022-11-28";

// TODO add base language to repo settings
const baseLanguage = "en";

type Props = {
  repo: Repository;
  children: JSX.Element | JSX.Element[];
};

const RepoStoreProvider = (props: Props): JSX.Element => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [translationFiles, setTranslationFiles] = useState<
    TranslationFile[] | null
  >(null);
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

  // Fetch repository translation files
  const fetchRepositoryTranslationFiles = async (): Promise<void> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });

    try {
      // First get all language folders in the translation folder
      const repoContent: { data: { name: string }[] } = await octokit.request(
        `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FOLDER}`,
        {
          owner: props.repo.owner.login,
          repo: props.repo.name,
          headers: {
            "X-GitHub-Api-Version": GITHUB_API_VERSION,
          },
        }
      );
      const repoLanguages = repoContent.data.map((obj) => obj.name);

      // Then get the translation files from the language folder
      const files = await Promise.all(
        repoLanguages.map(async (lang) => {
          const res: { data: { name: string }[] } = await octokit.request(
            `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FOLDER}/${lang}`,
            {
              owner: props.repo.owner.login,
              repo: props.repo.name,
              headers: {
                "X-GitHub-Api-Version": GITHUB_API_VERSION,
              },
            }
          );

          // Then get the translation file content
          return await Promise.all(
            res.data.map(async (file) => {
              const res = await octokit.request(
                `GET /repos/{owner}/{repo}/contents/${TRANSLATION_FOLDER}/${lang}/${file.name}`,
                {
                  owner: props.repo.owner.login,
                  repo: props.repo.name,
                  headers: {
                    "X-GitHub-Api-Version": GITHUB_API_VERSION,
                  },
                }
              );
              return {
                name: res.data.name,
                nameDisplay: res.data.name.replace(".json", ""),
                path: res.data.path,
                data: JSON.parse(
                  Buffer.from(res.data.content, "base64").toString()
                ),
                sha: res.data.sha,
                lang,
              };
            })
          );
        })
      );

      setTranslationFiles(files.flat());
    } catch (err: unknown) {
      if (`${err}`.includes("Not Found")) {
        // the translation files do not exist yet; allow the user to create a new one
        return;
      }
      throw err;
    }
  };

  // Create or Update repository translation file
  const createOrUpdateRepositoryTranslationFile = async (
    data: any,
    lang: string,
    category: string,
    sha: string | null
  ): Promise<void> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: props.repo.owner.login,
      repo: props.repo.name,
      path: `${TRANSLATION_FOLDER}/${lang}/${category}.json`,
      sha: sha ?? undefined,
      message: sha
        ? `[Translate] Update translation for ${lang}/${category}`
        : `[Translate] Create translation for ${lang}/${category}`,
      content: Buffer.from(JSON.stringify(data)).toString("base64"),
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    });
  };

  // Set up new translation repo
  const setupRepository = async (lang: string): Promise<void> => {
    await createOrUpdateRepositoryTranslationFile(
      { hello_world: "Hello World" },
      lang,
      "common", // default category
      null
    );
    await fetchRepositoryTranslationFiles();
  };

  // Add new translation
  const addTranslation = async (
    translation: Translation,
    lang: string,
    category: string
  ): Promise<void> => {
    if (!translationFiles) throw new Error("No translation files");

    let translationFile = translationFiles.find(
      (obj) => obj.nameDisplay == category && obj.lang == lang
    );
    if (!translationFile) {
      translationFile = {
        name: `${category}.json`,
        nameDisplay: category,
        path: `${TRANSLATION_FOLDER}/${lang}/${category}.json`,
        data: {},
        sha: null,
        lang,
      };
    }

    const data = { ...translationFile.data };
    data[translation.key] = translation.value;

    await createOrUpdateRepositoryTranslationFile(
      data,
      lang,
      category,
      translationFile.sha
    );
    await fetchRepositoryTranslationFiles();
  };

  // Update existing translation group
  const updateTranslationGroup = async (
    oldTranslationGroup: TranslationGroup,
    newTranslationGroup: TranslationGroup
  ): Promise<void> => {
    if (!translationFiles) throw new Error("No translation files");

    await Promise.all(
      newTranslationGroup.translations.map(async (translation) => {
        let translationFile = translationFiles.find(
          (obj) =>
            obj.nameDisplay == newTranslationGroup.category &&
            obj.lang == translation.lang
        );
        if (!translationFile) {
          translationFile = {
            name: `${newTranslationGroup.category}.json`,
            nameDisplay: newTranslationGroup.category,
            path: `${TRANSLATION_FOLDER}/${translation.lang}/${newTranslationGroup.category}.json`,
            data: {},
            sha: null,
            lang: translation.lang,
          };
        }

        const data = { ...translationFile.data };
        let dataDidChange = false;

        if (oldTranslationGroup.key != newTranslationGroup.key) {
          // Key has changed, first delete old key and then add new one
          delete data[oldTranslationGroup.key];
          dataDidChange = true;
        }
        if (data[newTranslationGroup.key] != translation.value) {
          data[newTranslationGroup.key] = translation.value;
          dataDidChange = true;
        }

        if (!dataDidChange) {
          // Nothing changed, skip update
          return;
        }

        await createOrUpdateRepositoryTranslationFile(
          data,
          translation.lang,
          translationFile.nameDisplay,
          translationFile.sha
        );
      })
    );

    await fetchRepositoryTranslationFiles();
  };

  // Delete translation group
  const deleteTranslationGroup = async (
    translationGroup: TranslationGroup
  ): Promise<void> => {
    if (!translationFiles) throw new Error("No translation files");

    await Promise.all(
      translationGroup.translations.map(async (translation) => {
        let translationFile = translationFiles.find(
          (obj) =>
            obj.nameDisplay == translationGroup.category &&
            obj.lang == translation.lang
        );
        if (!translationFile) {
          translationFile = {
            name: `${translationGroup.category}.json`,
            nameDisplay: translationGroup.category,
            path: `${TRANSLATION_FOLDER}/${translation.lang}/${translationGroup.category}.json`,
            data: {},
            sha: null,
            lang: translation.lang,
          };
        }

        const data = { ...translationFile.data };

        if (!Object.keys(data).includes(translationGroup.key)) {
          // Key does not exist, skip update
          return;
        }

        delete data[translationGroup.key];

        await createOrUpdateRepositoryTranslationFile(
          data,
          translation.lang,
          translationFile.nameDisplay,
          translationFile.sha
        );
      })
    );

    await fetchRepositoryTranslationFiles();
  };

  const fetchHistory = async (): Promise<Commit[]> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    const res = await octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner: props.repo.owner.login,
      repo: props.repo.name,
      headers: {
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
    });
    const commits = res.data.map((obj) => ({
      sha: obj.sha,
      message: obj.commit.message,
      patch: "",
      author: {
        name: obj.commit.author?.name ?? "",
        email: obj.commit.author?.email ?? "",
        date: moment(obj.commit.author?.date ?? ""),
        avatar_url: obj.author?.avatar_url ?? "",
      },
      committer: {
        name: obj.commit.committer?.name ?? "",
        email: obj.commit.committer?.email ?? "",
        date: moment(obj.commit.committer?.date ?? ""),
        avatar_url: obj.committer?.avatar_url ?? "",
      },
    }));

    return await Promise.all(
      commits.map(async (obj) => {
        const patch = await fetchPathForCommit(obj);
        return { ...obj, patch };
      })
    );
  };

  const fetchPathForCommit = async (commit: Commit): Promise<string> => {
    const session = await getSession();
    if (!session) throw new Error("Invalid session");

    const octokit = new Octokit({ auth: session.accessToken });
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      {
        owner: props.repo.owner.login,
        repo: props.repo.name,
        ref: commit.sha,
        headers: {
          "X-GitHub-Api-Version": GITHUB_API_VERSION,
        },
      }
    );
    if (!res.data.files || (res.data.files?.length ?? 0) == 0) {
      return "";
    }
    return res.data.files[0].patch ?? "";
  };

  const getCategories = (): string[] =>
    TranslationHelper.getCategories(translationFiles ?? []);
  const getLanguages = (): Language[] =>
    TranslationHelper.getLanguages(translationFiles ?? []).map((obj) => {
      const entry = emojiFlags.find((emoji) => emoji.code == obj);
      if (entry) {
        return {
          code: entry.code.toLowerCase(),
          name: entry.name,
          emoji: entry.emoji ?? entry.code.toUpperCase(),
        };
      }
      return { code: obj, name: obj, emoji: "" };
    });

  const getTranslationGroups = (): TranslationGroup[] => {
    let groups: TranslationGroup[] = [];

    translationFiles?.forEach((file) => {
      Object.keys(file.data).map((key) => {
        let group = groups.find((obj) => obj.key == key);
        if (!group) {
          group = {
            category: file.nameDisplay,
            key,
            translations: [],
          };
        }

        const value =
          typeof file.data[key] == "string"
            ? file.data[key]
            : `${file.data[key]}`;
        if (value) {
          group.translations.push({
            key,
            value,
            lang: file.lang,
          });
        }

        groups = [...groups.filter((obj) => obj.key != key), group];
      });
    });

    return groups;
  };

  // Load repository data
  useEffect(() => {
    (async () => {
      await fetchRepositoryContributors();
      await fetchRepositoryTranslationFiles();
      setLoading(false);
    })();
  }, []);

  return (
    <RepoStoreContext.Provider
      value={{
        isLoading,
        baseLanguage,
        contributors,
        translationFiles,
        setupRepository,
        addTranslation,
        updateTranslationGroup,
        deleteTranslationGroup,
        fetchHistory,
        getCategories,
        getLanguages,
        getTranslationGroups,
      }}
    >
      {props.children}
    </RepoStoreContext.Provider>
  );
};

export default RepoStoreProvider;

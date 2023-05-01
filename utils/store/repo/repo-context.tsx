import { createContext, useContext } from "react";
import { User, File, Translation } from "../../models";

type RepoStoreContextType = {
  isLoading: boolean;

  contributors: User[];

  translationFile: File | null;

  setupRepository: () => Promise<void>;

  addTranslation: (translation: Translation) => Promise<void>;
  updateTranslation: (
    oldTranslation: Translation,
    newTranslation: Translation
  ) => Promise<void>;
  deleteTranslation: (translation: Translation) => Promise<void>;
};

export const RepoStoreContext = createContext<RepoStoreContextType | undefined>(
  undefined
);

export const useRepoStore = (): RepoStoreContextType => {
  const ctx = useContext(RepoStoreContext);
  if (!ctx) throw new Error("Invalid context");
  return ctx;
};

import { createContext, useContext } from "react";
import { User } from "../../models";

type RepoStoreContextType = {
  isLoading: boolean;

  contributors: User[];
};

export const RepoStoreContext = createContext<RepoStoreContextType | undefined>(
  undefined
);

export const useRepoStore = (): RepoStoreContextType => {
  const ctx = useContext(RepoStoreContext);
  if (!ctx) throw new Error("Invalid context");
  return ctx;
};

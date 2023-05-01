export type Repository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  updated_at: string | null;
  owner: {
    login: string;
  };
};

export type User = {
  id?: number;
  login?: string;
  avatar_url?: string;
  contributions?: number;
};

export type File = {
  name: string;
  path: string;
  data: { [key: string]: string };
  sha: string;
};

export type Translation = {
  key: string;
  value: string;
};

import moment from "moment";

export type Repository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  updated_at: string | null;
  pushed_at: string | null;
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

export type Commit = {
  sha: string;
  message: string;
  patch: string;
  author: {
    name: string;
    email: string;
    date: moment.Moment;
    avatar_url: string;
  };
  committer: {
    name: string;
    email: string;
    date: moment.Moment;
    avatar_url: string;
  };
};

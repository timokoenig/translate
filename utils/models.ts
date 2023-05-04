import moment from "moment";

export type User = {
  id?: number;
  login?: string;
  avatar_url?: string;
  contributions?: number;
};

export type Repository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  updated_at: string | null;
  pushed_at: string | null;
  owner: {
    login: string;
  };
};

export type TranslationFile = {
  name: string;
  nameDisplay: string;
  path: string;
  data: { [key: string]: string };
  sha: string | null;
  lang: string;
};

export type Translation = {
  key: string;
  value: string;
  lang: string;
};

export type TranslationGroup = {
  category: string;
  key: string;
  translations: Translation[];
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

export type Language = {
  name: string;
  code: string;
  emoji: string;
};

export type Filter = {
  category: string | null;
  language: string | null;
  missingTranslations: boolean;
};

import moment from 'moment'

export type User = {
  id?: number
  login?: string
  avatar_url?: string
  contributions?: number
}

export type Repository = {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  default_branch: string
  updated_at: string | null
  pushed_at: string | null
  owner: {
    login: string
  }
  contributors: User[]
  files: TranslationFile[]
  languages: Language[]
  categories: string[]
  branches: Branch[]
}

export type TranslationFileData = { [key: string]: string | TranslationFileData }

export type TranslationFile = {
  name: string
  nameDisplay: string
  path: string
  data: TranslationFileData
  sha: string | null
  lang: string
}

export type Translation = {
  key: string
  value: string
  lang: string
}

export type TranslationGroup = {
  category: string
  key: string
  keyPath: string[]
  translations: Translation[]
  children: TranslationGroup[]
}

export type Commit = {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: moment.Moment
    avatar_url: string
  }
  committer: {
    name: string
    email: string
    date: moment.Moment
    avatar_url: string
  }
}

export type Language = {
  name: string
  code: string
  emoji: string
}

export type Filter = {
  category: string | null
  language: string | null
  missingTranslations: boolean
}

export type Branch = {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

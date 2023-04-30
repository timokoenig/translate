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

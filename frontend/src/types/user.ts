import type { RoleType } from '~/constants/enums';

export type TeamType = {
  id: string;
  name: string;
};

export type UserAdminType = {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  teamId: string | null;
  teamName: string | null;
  isFirstLogin: number;
  rawPassword: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  role: RoleType;
  teamId?: string | null;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  role?: RoleType;
  teamId?: string | null;
};

export type CreateUserResult = {
  user: Omit<UserAdminType, 'teamName'>;
  rawPassword: string;
};

export type ResetPasswordResult = {
  rawPassword: string;
};

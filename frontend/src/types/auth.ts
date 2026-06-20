import type { RoleType } from '~/constants/enums';

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ApiResponse<T = unknown> = {
  status: boolean;
  message: string;
  result: T;
};

export type LoginResult = UserType & {
  access_token: string;
  refresh_token: string;
};

export type RefreshResult = {
  access_token: string;
  refresh_token: string;
};

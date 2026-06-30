import type { RoleType } from '~/constants/enums';

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  teamId: string | null;
  isFirstLogin: number;
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

export type LoginResult = UserType;

import type { JwtPayload } from 'jsonwebtoken';

import type { RoleType, TokenType } from '~/constants/enums';

export interface TokenPayload extends JwtPayload {
  userId: string;
  type: TokenType;
  role: RoleType;
  exp: number;
  iat: number;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

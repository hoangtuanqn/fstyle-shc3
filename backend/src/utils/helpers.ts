import type { Request } from 'express';

import { TokenType } from '~/constants/enums';

import type { TokenPayload } from '~/rules/requests/user.request';

export class Helpers {
  static getTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;
    const parts = authHeader.split(' ');
    if (parts.length < 2 || !parts[1]) return null;
    return parts[1];
  }

  static isTypeToken(payload: TokenPayload, type: TokenType): boolean {
    return payload.type === type;
  }

  static hasRole(roles: string[], role: string): boolean {
    return roles.includes(role);
  }
}

import type { RoleType } from '~/constants/enums';
import type { TokenPayload } from '~/rules/requests/user.request';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: RoleType;
      tokenPayload?: TokenPayload;
    }
  }
}

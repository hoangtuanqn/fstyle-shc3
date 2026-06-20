export const RoleType = {
  ADMIN: 'ADMIN',
  BTC_FSTYLE: 'BTC_FSTYLE',
  MC: 'MC',
  MEMBER: 'MEMBER',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

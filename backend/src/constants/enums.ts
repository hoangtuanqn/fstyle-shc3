export enum RoleType {
  ADMIN = 'ADMIN',
  BTC_FSTYLE = 'BTC_FSTYLE',
  MC = 'MC',
  MEMBER = 'MEMBER',
}

export enum TokenType {
  AccessToken = 'AccessToken',
  RefreshToken = 'RefreshToken',
}

export enum ExpiresInTokenType {
  AccessToken = 15 * 60, // 15 minutes
  RefreshToken = 30 * 24 * 60 * 60, // 30 days
}

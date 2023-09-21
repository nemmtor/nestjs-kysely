import { RefreshTokenTable, TokenFamilyTable, UserTable } from './tables';

export type DatabaseConfig = {
  database: string;
  host: string;
  password: string;
  port: number;
  user: string;
};

export type Tables = {
  refreshToken: RefreshTokenTable;
  tokenFamily: TokenFamilyTable;
  user: UserTable;
};

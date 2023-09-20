import { TokenFamilyTable, RefreshTokenTable } from 'src/auth/model';
import { UserTable } from 'src/user/model';

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type Tables = {
  user: UserTable;
  tokenFamily: TokenFamilyTable;
  refreshToken: RefreshTokenTable;
};

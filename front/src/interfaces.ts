import { Role } from './enums';

export interface ITokens {
  refreshToken: string;
  accessToken: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
}

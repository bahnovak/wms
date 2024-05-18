import { ActiveUserData, ITokens, SignInDto } from '../interfaces';
import api from './index';

export const refreshTokens = async (refreshToken: string): Promise<ITokens> =>
  api.post('/authentication/refresh-tokens', { refreshToken });

export const signIn = async (signInDto: SignInDto): Promise<ITokens> =>
  api.post('/authentication/sign-in', signInDto);

export const identify = async (): Promise<ActiveUserData> => api.get('/');

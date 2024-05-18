import api from '../api';
import { refreshTokens } from '../api/authentication';
import config from '../config';
import { ITokens } from '../interfaces';

const resetSession = () => {
  localStorage.removeItem(config.auth.tokens.refresh);
  localStorage.removeItem(config.auth.tokens.access);
  delete api.defaults.headers.common['Authorization'];
};

export const setSession = async ({ refreshToken, accessToken }: ITokens) => {
  await localStorage.setItem(config.auth.tokens.refresh, refreshToken);
  await localStorage.setItem(config.auth.tokens.access, accessToken);
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const refreshSession = async (session: {
  isBadRefreshToken: boolean;
}) => {
  try {
    const refreshToken = localStorage.getItem(config.auth.tokens.refresh);
    if (!refreshToken) throw Error;
    const session = await refreshTokens(refreshToken);

    await setSession(session);
    window.location.replace('/');
  } catch (err) {
    session.isBadRefreshToken = true;
  }
};

export const logOut = async () => {
  resetSession();
};

export const isAuthenticated = () =>
  !!localStorage.getItem(config.auth.tokens.refresh) &&
  !!localStorage.getItem(config.auth.tokens.access);

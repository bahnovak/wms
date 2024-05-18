import axios from 'axios';
import config from '../config';
// import toaster from 'services/toaster';
import {
  isAuthenticated,
  refreshSession,
  logOut,
} from '../services/authentication';

const session = {
  accessToken: localStorage.getItem(config.auth.tokens.access),
  isRefreshing: false,
  isBadRefreshToken: false,
};

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  ...(session.accessToken
    ? {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    : {}),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interceptSuccessResponse = ({ data }: { data: any }) => data;

instance.interceptors.response.use(interceptSuccessResponse, async (err) => {
  if (err.response?.status === 401) {
    if (!isAuthenticated()) {
      logOut();
    } else if (isAuthenticated() && !session.isRefreshing) {
      session.isRefreshing = true;
      await refreshSession(session);
      session.isRefreshing = false;
    } else if (isAuthenticated() && session.isBadRefreshToken) {
      logOut();
      session.isRefreshing = false;
      session.isBadRefreshToken = false;
    }
  }

  return Promise.reject(err);
});

export default instance;

import {wrap, unwrap, ResultCreator} from '../utils';
import {fetchApi} from './shared.api';

const authApi = '/api/auth';
const loginApi = `${authApi}/login`;
const logoutApi = `${authApi}/logout`;
const refreshTokenApi = `${authApi}/refresh_token`;
const userApi = `${authApi}/who`;
const registerApi = `${authApi}/register`;

let inMemoryToken: {jwt_token: string; jwt_token_exp: string} | undefined;

const login = async (form: FormData | Record<string, string>) => {
  const response = await fetchApi(loginApi, {
    method: 'post',
    credentials: 'include',
    mode: 'cors',
    body: new URLSearchParams(form as Record<string, string>),
  });

  const {jwt_token, jwt_token_exp} = await unwrap(response).json();
  inMemoryToken = {jwt_token, jwt_token_exp};
  return inMemoryToken;
};

const logout = async () => {
  if (inMemoryToken === undefined) {
    return;
  }
  const {jwt_token} = inMemoryToken;
  inMemoryToken = undefined;
  await fetchApi(logoutApi, {
    headers: {
      Authorization: `Bearer ${jwt_token}`,
    },
  });
};

const register = async (form: FormData | Record<string, string>) => {
  return fetchApi(registerApi, {
    method: 'POST',
    body: new URLSearchParams(form as Record<string, string>),
  }).then(response => unwrap(response).json());
};

const user = async () => {
  return fetchWithAuth(userApi).then(
    response => response && unwrap(response).text()
  );
};

/**
 * Refresh the token of user identity
 */
const refreshToken = async (): Promise<typeof inMemoryToken> => {
  return fetchApi(refreshTokenApi).then(response => unwrap(response).json());
};

/**
 * Validate the token and try to refresh it if it is expired
 * @returns The token of user identity
 */
const validateToken = async () => {
  const isExpire = (jwtTokenExp: string) =>
    jwtTokenExp !== '' &&
    Number(new Date(jwtTokenExp)) - Number(new Date()) < 60_000; // if less than 1min, then refresh token
  if (inMemoryToken === undefined || isExpire(inMemoryToken.jwt_token_exp)) {
    [inMemoryToken] = await wrap(refreshToken)();
    if (inMemoryToken === undefined) {
      return;
    }
  }
  return inMemoryToken.jwt_token;
};

export async function fetchWithAuth(...arg: Parameters<typeof fetch>) {
  const token = await validateToken();
  if (token === undefined) {
    return ResultCreator.Err(new Error('login required'));
  }
  return fetchApi(arg[0], {
    ...arg[1],
    headers: {
      ...arg[1]?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export default {
  login: wrap(login),
  logout: wrap(logout),
  register: wrap(register),
  user: wrap(user),
};

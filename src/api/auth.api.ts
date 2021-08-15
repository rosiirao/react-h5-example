import {HttpError} from '../helper/http-util';
import {Result} from '../helper/promise-util';
import {wrap, unwrap} from '../helper/promise-util';

const authApi = '/api/auth';
const loginApi = `${authApi}/login`;
const logoutApi = `${authApi}/logout`;
const refreshTokenApi = `${authApi}/refresh_token`;
const userApi = `${authApi}/who`;
const registerApi = `${authApi}/register`;

let inMemoryToken: {jwt_token: string; jwt_token_exp: string} | undefined;

const fetchApi = (
  ...arg: Parameters<typeof fetch>
): Promise<Result<Response, HttpError | Error>> => {
  const result = fetch(...arg).then(async response => {
    const status = response.status;
    if (status >= 400) {
      throw new HttpError(status, {response}, await response.text());
    }
    return response;
  });
  return wrap(result);
};

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
  inMemoryToken = await fetchApi(registerApi, {
    method: 'POST',
    body: new URLSearchParams(form as Record<string, string>),
  }).then(response => unwrap(response).json());
};

const user = async () => {
  const token = await validateToken();
  if (token === undefined) {
    return;
  }
  return fetchApi(userApi, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => unwrap(response).text());
};

const refreshToken = async (): Promise<typeof inMemoryToken> => {
  return fetchApi(refreshTokenApi).then(response => unwrap(response).json());
};

const validateToken = async () => {
  const isExpire = (jwtTokenExp: string) =>
    Number(new Date(jwtTokenExp)) - Number(new Date()) < 60_000; // if less than 1min, then refresh token
  if (inMemoryToken === undefined || isExpire(inMemoryToken.jwt_token_exp)) {
    [inMemoryToken] = await wrap(refreshToken)();
    if (inMemoryToken === undefined) {
      return;
    }
  }
  return inMemoryToken.jwt_token;
};

export default {
  login: wrap(login),
  logout: wrap(logout),
  register: wrap(register),
  user: wrap(user),
};

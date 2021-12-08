import {HttpError, Result, wrap} from '../utils';

/**
 * Handle the http errors of fetch when fetch resources
 * @param arg The arguments to pass to fetch
 */
export const fetchApi = (
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

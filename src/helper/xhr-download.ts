import createPromise from '../helper/promise-util';

import {HttpError} from './http-util';

/**
 * Blob to String
 */
const stringBlob = async (blob: Blob) => {
  if (blob.text !== undefined) {
    return blob.text();
  }

  const [p, ok, err] = createPromise<string>();
  const reader = new FileReader();
  reader.readAsText(blob);
  reader.onload = () => {
    ok(reader.result as string);
  };
  reader.onerror = () => {
    err(reader.error!);
  };
  return p;
};

/**
 * 获取 blog 数据
 */
export const fetchBlob = async (
  url: string,
  method = 'GET',
  data?: string,
  contentType?: string
) => {
  const xhr = new XMLHttpRequest();

  const [p, ok, err] = createPromise<Blob>();

  xhr.onreadystatechange = async function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) {
        err(new HttpError(xhr.status, xhr, '转换 excel 表格服务响应异常'));
        return;
      }
      if (xhr.responseType !== 'blob') {
        err(
          new HttpError(
            200,
            xhr,
            `转换 excel 表格服务返回数据格式不匹配， 返回类型为 ${xhr.responseType}`
          )
        );
        return;
      }
      if (
        /application\/json/i.test(xhr.getResponseHeader('Content-Type') ?? '')
      ) {
        const response = await stringBlob(xhr.response.text);
        try {
          const {msg = response} = JSON.parse(response);
          err(new HttpError(200, xhr, `转换 excel 表格服务响应错误 : ${msg}`));
        } catch (e) {
          console.error(e);
          err(
            new HttpError(
              200,
              xhr,
              `转换 excel 表格服务返回数据格式不匹配， 返回值为 ${response}`
            )
          );
        }
        return;
      }
      ok(xhr.response);
    }
  };

  try {
    xhr.open(method, url, true);
    if (contentType !== undefined) {
      xhr.setRequestHeader('Content-Type', contentType);
    }
    xhr.responseType = 'blob';
    xhr.send(data);
  } catch (e) {
    if (e instanceof Error) {
      err!(e);
    } else {
      err!(new Error(`脚本错误: ${String(e)}`));
    }
  }
  return p;
};

export const fetchDownload = async (
  fetchOption: {
    url: string;
    method: 'GET' | 'POST';
    data?: string;
    contentType?: string;
  },
  fileName?: string
) => {
  const {url, method = 'GET', data, contentType} = fetchOption;
  const blob = await fetchBlob(url, method, data, contentType);

  // If IE 10+
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, fileName);
    return;
  }
  // window.open(URL.createObjectURL(blob));     // 不能指定文件名, 使用 click a 方式

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  if (fileName !== undefined) {
    a.setAttribute('download', fileName);
  }
  a.click();
  a.remove();
};

export {fetchDownload as default};

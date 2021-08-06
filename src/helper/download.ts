class XhrError extends Error {
  status;
  xhr;
  constructor(
    status: number,
    xhr: XMLHttpRequest,
    ...errorParam: Parameters<ErrorConstructor>
  ) {
    super(...errorParam);
    this.status = status;
    this.xhr = xhr;
  }
}

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
  let ok: (value: Blob) => void, err: (value: Error) => void;
  const p = new Promise<Blob>((r, j) => {
    ok = r;
    err = j;
  });

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) {
        err(new XhrError(xhr.status, xhr, '转换 excel 表格服务响应异常'));
        return;
      }
      if (xhr.responseType !== 'blob') {
        err(
          new XhrError(
            200,
            xhr,
            `转换 excel 表格服务返回数据格式不匹配， 返回类型为 ${xhr.responseType}`
          )
        );
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

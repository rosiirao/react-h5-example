export function postForm(uri: string, formData: FormData) {
  return fetch(uri, {
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'post',
  });
}

export function postFormAsURLSchema(uri: string, formData: FormData) {
  const data = new URLSearchParams();
  for (const pair of formData) {
    if (typeof pair[1] !== 'string') {
      throw new Error('表单非字符串类型数据不能使用 urlencoded 方式提交');
    }
    data.append(pair[0], pair[1]);
  }
  return fetch(uri, {
    body: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Type': 'multipart/form-data',
    },
    method: 'post',
  });
}

export function FileUpload(img: unknown, file: File) {
  const reader = new FileReader();
  // const ctrl = createThrobber(img);
  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener(
    'progress',
    e => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded * 100) / e.total);
        console.log(percentage);
        // ctrl.update(percentage);
      }
    },
    false
  );

  xhr.upload.addEventListener(
    'load',
    () => {
      // self.ctrl.update(100);
      // const canvas = self.ctrl.ctx.canvas;
      // canvas.parentNode.removeChild(canvas);
    },
    false
  );
  xhr.open(
    'POST',
    'http://demos.hacks.mozilla.org/paul/demos/resources/webservices/devnull.php'
  );
  xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
  reader.onload = ev => {
    xhr.send(ev.target!.result);
  };
  reader.readAsBinaryString(file);
}

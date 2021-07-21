const oReq = new XMLHttpRequest();

oReq.addEventListener('progress', updateProgress);
oReq.addEventListener('load', transferComplete);
oReq.addEventListener('error', transferFailed);
oReq.addEventListener('abort', transferCanceled);

const upload = (method: string, url: string, file: File) => {
  oReq.open(method, url);
  oReq.send(file); // ArrayBuffer | ArrayBufferView | Blob(File) | FormData | URLSearchParams
  return oReq;
};

// ...
// progress on transfers from the server to the client (downloads)
function updateProgress(oEvent: ProgressEvent) {
  if (oEvent.lengthComputable) {
    const percentComplete = (oEvent.loaded / oEvent.total) * 100;
    return percentComplete;
    // ...
  }

  // Unable to compute progress information since the total size is unknown
  throw new Error('xhr.upload.progress is not supported!');
}

function transferComplete(_evt: Event) {
  console.log('The transfer is complete.');
}

function transferFailed(_evt: Event) {
  console.log('An error occurred while transferring the file.');
}

function transferCanceled(_evt: Event) {
  console.log('The transfer has been canceled by the user.');
}

export default upload;

/** some decoder only support Latin_1 encoding, eg. src/core/pdf417/decoder/DecodedBitStreamParser.decode */
import {
  // BrowserMultiFormatReader,  // call reader.reset() after finished reading every time
  BarcodeFormat,
  DecodeHintType,
  // QRCodeWriter,
  // MultiFormatWriter /** only QRWriter implemented in zxing-js */,
  // QRCodeReader,
  // BitMatrix,
} from '@zxing/library';
import {
  BrowserMultiFormatReader,
  BrowserQRCodeSvgWriter,
  IScannerControls,
} from '@zxing/browser';
import {DecodeContinuouslyCallback} from '@zxing/browser/esm/common/DecodeContinuouslyCallback';

const hints = new Map();
const formats = [
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.PDF_417,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_128 /*, ...*/,
];

hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

const reader = new BrowserMultiFormatReader();

reader.setHints(hints);

export const decodeCodeFromImage = async (
  el: HTMLImageElement
  // ...[imgByteArray, imgWidth, imgHeight]: ConstructorParameters<
  //   typeof RGBLuminanceSource
  // >
) => {
  // const luminanceSource = new RGBLuminanceSource(
  //   imgByteArray,
  //   imgWidth,
  //   imgHeight
  // );
  // const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

  // reader.reset();
  // try {
  //   return reader.decode(el);
  // } catch (e) {
  //   console.error(e);
  // }
  return reader.decodeFromImageElement(el);
  // .decodeFromImage(el)

  // .finally(() => {
  //   // reader.reset();
  // })
  // return;
};

export const decodeCodeFromVideo = async (
  stream: MediaStream,
  video: HTMLVideoElement,
  fn: DecodeContinuouslyCallback
) => {
  return await reader.decodeFromStream(stream, video, fn);
};

export type {IScannerControls};

// BinaryBitmap
// const bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
//     for (int x = 0; x < width; x++){
//         for (int y = 0; y < height; y++){
//             bmp.setPixel(x, y, bitMatrix.get(x,y) ? Color.BLACK : Color.WHITE);
//         }
//     }

const codeWriter = new BrowserQRCodeSvgWriter();
export const encodeToContainer = (container: HTMLElement, textInput: string) =>
  codeWriter.writeToDom(
    container,
    textInput,
    320,
    320,
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_93])
  );

const b64Start = 'data:image/svg+xml;base64,';
/**
 * convert SVG to img src
 */
export const svgToImageSrc = (svg: SVGElement) => {
  const xml = new XMLSerializer().serializeToString(svg);
  return b64Start + btoa(xml);
};

/**
 * below works only on chrome
 */
export function getUserMediaImgCapture(
  mediaStream: MediaStream,
  video: HTMLVideoElement
) {
  video.srcObject = mediaStream;

  const track = mediaStream.getVideoTracks()[0];
  return new ImageCapture(track);
}

export function drawCanvas(canvas: HTMLCanvasElement, img: ImageBitmap) {
  canvas.width = +getComputedStyle(canvas).width.split('px')[0];
  canvas.height = +getComputedStyle(canvas).height.split('px')[0];
  const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  const x = (canvas.width - img.width * ratio) / 2;
  const y = (canvas.height - img.height * ratio) / 2;
  const ctx = canvas.getContext('2d');
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx?.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    x,
    y,
    img.width * ratio,
    img.height * ratio
  );
}

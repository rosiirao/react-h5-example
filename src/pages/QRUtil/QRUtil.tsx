import React, {SyntheticEvent, useCallback, useRef, useState} from 'react';

import {decodeCodeFromImage} from './Util';

import QRReader from './QRReaderForm';
import QRWriter from './QRWriterForm';
import AvailableDevices from './AvailableDevices';

import './QRUtil.scss';

export default () => {
  const [qrText, setQRText] = useState<string>();
  const [qrImgSrc, setQRImgSrc] = useState('');
  const img = useRef<HTMLImageElement>(null);

  const onLoadImage: React.EventHandler<
    SyntheticEvent<HTMLImageElement, Event>
  > = useCallback(
    evt => {
      const img = evt.target as HTMLImageElement;
      // const width = img.current!.width;
      // const height = img.current!.height;

      decodeCodeFromImage(img)
        .then(r => {
          if (r === undefined) {
            throw new Error('No code recognize!');
          }
          setQRText(r.getText());
        })
        .catch(e => {
          console.error(e);
          setQRText('');
        });

      const reader = new FileReader();
      reader.onload = function () {
        // const arrayBuffer: ArrayBuffer = this.result as ArrayBuffer;
        // console.log(arrayBuffer);
        // // decodeQR(new Uint8ClampedArray(arrayBuffer), width, height);
      };
      // const fileList = fileInput.current!.files!;

      // for (let i = 0; i < fileList?.length; i++) {
      //   if (fileList[i].type.match(/^image\//)) {
      //     reader.readAsArrayBuffer(fileList[i]);
      //     break;
      //   }
      // }
    },
    [setQRText]
  );

  return (
    <>
      <article>
        <h2>QR code utilizations</h2>
        <QRReader updateCodeImage={setQRImgSrc} updateCodeText={setQRText} />
        <QRWriter updateCodeImage={setQRImgSrc} />

        {qrImgSrc ? (
          <section>
            <h4>Code And Text</h4>
            <p>
              <img
                alt="QR Code"
                src={qrImgSrc}
                ref={img}
                onLoad={onLoadImage}
                className="qr-image"
              />
              <code className="qr-text">{qrText}</code>
            </p>
          </section>
        ) : null}
        <aside>
          <h3>Device List</h3>
          <AvailableDevices />
        </aside>
      </article>
    </>
  );
};

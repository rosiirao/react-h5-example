import React, {useState, useEffect, useRef, useCallback} from 'react';
import {IScannerControls, decodeCodeFromVideo} from './Util';

type Device = {deviceId: string; label: string};

let _deviceList: Device[];

const listVideoDevices = async () => {
  if (!('mediaDevices' in navigator)) {
    alert('Your camera is unavailable!');
    return;
  }
  if (_deviceList !== undefined) return _deviceList;
  const enumeratorPromise = navigator.mediaDevices.enumerateDevices();
  return enumeratorPromise.then(dc => {
    return (_deviceList = dc.reduce((d, {deviceId, label, kind}) => {
      if (kind === 'videoinput') {
        d.push({deviceId, label});
      }
      return d;
    }, [] as typeof _deviceList));
  });
};

const stopStream = (stream: MediaStream) => {
  // stream.getAudioTracks();
  // stream.getVideoTracks();
  stream.getTracks().forEach(t => t.stop());
};

type Props = React.PropsWithChildren<{
  updateCodeText: (src: string) => void;
  updateCodeImage: (src: string) => void;
}>;
export default function QRReader(props: Props) {
  const {updateCodeText, updateCodeImage} = props;

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>();
  useEffect(() => {
    listVideoDevices().then(devices => {
      setDevices(devices ?? []);
      setSelectedDevice(devices?.[0].deviceId);
    });
    return () => {};
  }, [setDevices, setSelectedDevice]);

  const onSelectDevice = useCallback(
    e => {
      const value = e.target.value;
      setSelectedDevice(value);
    },
    [setSelectedDevice]
  );

  const onChangeFile = useCallback(e => {
    const fileList = e.target.files;
    let file;
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].type.match(/^image\//)) {
        file = fileList[i];
        updateCodeImage(URL.createObjectURL(file));
        break;
      }
    }
  }, []);
  const [encoding, setEncoding] = useState('utf-8');
  const onSelectEncoding = useCallback(
    e => {
      setEncoding(e.target.value);
    },
    [setEncoding]
  );

  const [scanCameraShow, setScanCameraShow] = useState(false);
  const currentStream = useRef<MediaStream | null>(null);
  const currentStreamControl = useRef<IScannerControls | null>(null);
  const decodeFromMedia = useCallback(() => {
    if (selectedDevice === undefined) {
      alert('No video input devices selected');
      return;
    }

    if (currentStream.current !== null) {
      // reader.reset();
      stopStream(currentStream.current);
    }

    const constraints = {
      audio: false,
      video: {deviceId: selectedDevice, facingMode: 'environment'},
    };
    const video = document.querySelector('video')!;
    video.focus();
    // show video before decode, otherwise safari can't show video when first active camera
    setScanCameraShow(true);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        // video.srcObject = stream;
        currentStream.current = stream;
        return decodeCodeFromVideo(stream, video, r => {
          if (r !== undefined) {
            updateCodeText(r.getText());
            setTimeout(() => {
              // stopStream(stream);
              currentStream.current = null;
              currentStreamControl.current?.stop();
              currentStreamControl.current = null;
            });
          }
        });
      })
      .then(control => {
        currentStreamControl.current = control;
        // control.stop();
      })
      .catch(e => {
        setScanCameraShow(false);
        console.error(e);
        alert(e);
      });
  }, [selectedDevice, encoding]);

  useEffect(() => {
    return () => {
      currentStreamControl.current?.stop();
      setScanCameraShow(false);
      if (currentStream.current !== null) stopStream(currentStream.current);
    };
  }, [currentStream, currentStreamControl]);

  return (
    <form
      className="qr-reader"
      onReset={() => {
        if (currentStream.current !== null) stopStream(currentStream.current);
        currentStreamControl.current?.stop();
        setScanCameraShow(false);
      }}
    >
      <h3>QR Decoder</h3>
      <label>
        Upload file:
        <input
          type="file"
          accept="image/*"
          id="file-input"
          onChange={onChangeFile}
          capture="environment"
        />
      </label>
      <label>
        Camera:
        <select onChange={onSelectDevice}>
          {devices.map(({deviceId: id, label}, i) => (
            <option value={id} key={id}>
              {`${label || 'Camera ' + i}`}
            </option>
          ))}
        </select>
      </label>
      <label hidden>
        {/** some decoder only support Latin_1 encoding, eg. src/core/pdf417/decoder/DecodedBitStreamParser.decode */}
        Encoding:
        <select onChange={onSelectEncoding}>
          <option value="utf-8">utf-8</option>
          <option value="gb2312">gb2312</option>
        </select>
      </label>
      <button type="button" onClick={decodeFromMedia}>
        Scan QR
      </button>
      <button type="reset">Reset Reader</button>
      <video
        hidden={!scanCameraShow}
        onEnded={() => {
          setScanCameraShow(false);
        }}
        onPause={() => {
          setScanCameraShow(false);
        }}
      />
    </form>
  );
}

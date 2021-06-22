import {useEffect, useMemo, useState} from 'react';

const useAvailableDevices = () => {
  const devicesWait = useMemo(async () => {
    const dc = await navigator.mediaDevices.enumerateDevices();
    return dc.map(d => d.toJSON());
  }, []);
  const [devices, setDevices] = useState<Record<string, unknown>[]>();
  useEffect(() => {
    devicesWait
      .then(dc => setDevices(dc))
      .catch(e => {
        console.error(e);
        alert(e);
      });
  }, [setDevices]);
  return devices;
};

export default () => {
  const availableDevices = useAvailableDevices();
  // const availableDevices = [] as Record<string, unknown>[];
  return (
    <>
      <pre className="json-list">
        {availableDevices?.map((d, i) => (
          <code key={i}>{JSON.stringify(d, null, '  ')}</code>
        ))}
      </pre>
    </>
  );
};

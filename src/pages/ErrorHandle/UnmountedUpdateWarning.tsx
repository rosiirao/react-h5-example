import {useEffect, useRef, useState} from 'react';

const useMounted = (debug?: string) => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      if (debug) console.log(`${debug} Unmounted`);
      mounted.current = false;
    };
  }, [debug]);
  return mounted;
};

const Inner = ({triggerWarn = false}: {triggerWarn?: boolean}) => {
  const [text, setText] = useState(
    `Inner Timeout Destroy Component with warning ${triggerWarn ? 'on' : 'off'}`
  );
  const mounted = useMounted('Inner');
  useEffect(() => {
    setTimeout(() => {
      // If no mounted guard, there may be a warning about update state on an unmounted component, indicates a memory leak
      // useEffect return function to clearTimeout can works too.
      if (triggerWarn || mounted.current) {
        console.log(
          `set update when ${mounted.current ? 'mounted' : 'unmounted'}`
        );
        setText('Inner text settled after 1000ms!');
      }
    }, 1000);
  });
  return <div>{text}</div>;
};

const SetupWarning = ({
  onSetWarning,
}: {
  onSetWarning?: (warning: boolean) => void;
}) => {
  const [warning, setWarning] = useState(false);
  const setWarningButtonHandle = () => {
    setWarning(!warning);
    onSetWarning?.(warning);
  };

  return (
    <div onClick={setWarningButtonHandle}>
      Click to {warning ? 'show' : 'disable'} warning for updating state on an
      unmounted component
    </div>
  );
};

export default () => {
  const [innerOn, setInnerOn] = useState(true);
  const [warning, triggerWarning] = useState(false);
  useEffect(() => {
    setInnerOn(true);
    setTimeout(() => {
      setInnerOn(false);
    }, 500);
  }, [warning]);

  return (
    <>
      <SetupWarning onSetWarning={triggerWarning} />
      {innerOn ? <Inner triggerWarn={warning} /> : null}
    </>
  );
};

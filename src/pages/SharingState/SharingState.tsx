import React, {useContext, useEffect, useState} from 'react';
import SharedContext, {ShareStates} from './SharedContext';

function A({children}: React.PropsWithChildren<{}>) {
  const {value, setValue} = useContext(ShareStates);
  return (
    <div>
      <h2>The component A used to set value</h2>
      <button onClick={() => setValue((v: number) => v + 1)}>
        Click to add value
      </button>
      <div>The current value is {value}</div>
      {children}
    </div>
  );
}

function B({children}: React.PropsWithChildren<{}>) {
  const {value} = useContext(ShareStates);
  return (
    <div>
      <h2>The component B get value from same hooks from A.</h2>
      The current value is {value}
      {children}
    </div>
  );
}

function C() {
  const [times, setTimes] = useState(0);

  // add number in useEffect
  useEffect(() => {
    setTimes(v => ++v);
    return () => {};
  }, []);
  return (
    <>
      <h3>The inner component without using shared states</h3>
      <div>The C has rendered {times} times.</div>
    </>
  );
}

export default function X() {
  return (
    <SharedContext>
      <h2> Sharing state between the following 2 components </h2>
      <A>
        <C></C>
      </A>
      <B>
        <C></C>
      </B>
    </SharedContext>
  );
}

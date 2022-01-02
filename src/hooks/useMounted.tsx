import {useEffect, useRef} from 'react';

export const useMounted = (debug?: string) => {
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

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Preloader from './Preloader';
import {debounce} from '../utils';

const Intersection_Event = 'custom_intersection';
const intersectionObserver = new window.IntersectionObserver(entries => {
  if (entries[0].intersectionRatio <= 0) return;
  entries[0].target.dispatchEvent(new Event(Intersection_Event));
});

export default (
  props: React.PropsWithChildren<{loader?: () => Promise<void>}>
) => {
  const {children, loader} = props;
  const preloader = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const prepareLoading = useCallback(() => setLoading(true), [setLoading]);
  const dataLoader = useMemo(
    () =>
      loader !== undefined
        ? debounce<void, typeof loader>(loader, 200)
        : undefined,
    [loader]
  );
  useEffect(() => {
    if (preloader.current === null) return;
    const preloaderEl = preloader.current;
    intersectionObserver.observe(preloader.current);
    // then listen the intersection event to loader
    preloaderEl.addEventListener(Intersection_Event, prepareLoading);
    return () => {
      intersectionObserver.disconnect();
      preloaderEl.removeEventListener(Intersection_Event, prepareLoading);
    };
  }, [preloader, prepareLoading]);

  useEffect(() => {
    if (loading) {
      dataLoader?.().then(() => setLoading(false));
    }
  }, [loading, setLoading, dataLoader]);
  return (
    <>
      {children}
      <div ref={preloader}>
        <Preloader />
      </div>
    </>
  );
};

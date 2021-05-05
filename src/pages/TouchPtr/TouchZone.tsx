import React, {
  TouchEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';

import usePtrStatus, {PtrStatus} from './usePtrStatus';

type PageY = number;
type OffsetY = number;
type Touches = {
  identifier: number;
  pageY: PageY;
  offsetY: OffsetY;
  end?: true;
}[];

const getTouches = (evt: React.TouchEvent<Element>, end?: true) => {
  const ongoingTouches: Touches = [];
  for (let i = 0; i < evt.changedTouches.length; i++) {
    const {identifier, pageY} = evt.changedTouches.item(i);
    ongoingTouches[i] = {
      identifier,
      pageY,
      offsetY: 0,
      ...(end ? {end} : undefined),
    };
  }
  return ongoingTouches;
};

const setTouchesAction =
  (
    threshold: number,
    touches: Touches
  ): React.SetStateAction<Touches | undefined> =>
  prev => {
    if (prev === undefined) return touches;
    const next: Touches = [...prev];
    for (const {identifier, pageY, end} of touches) {
      const i = next.findIndex(p => p.identifier === identifier);
      if (i === -1) {
        next.push({
          identifier,
          pageY,
          offsetY: 0,
          ...(end ? {end} : undefined),
        });
        return;
      }
      const {offsetY} = next[i];
      next[i] = {
        identifier,
        pageY,
        offsetY: Math.max(
          0,
          Math.min(threshold, offsetY + pageY - next[i].pageY)
        ),
        ...(end ? {end} : undefined),
      };
    }
    return next;
  };

const useTouchesAction = (threshold: number) =>
  useCallback(touches => setTouchesAction(threshold, touches), [threshold]);

const useTouch = (threshold: number) => {
  const [touches, setTouches] = useState<Touches>();
  const [move, setMove] = useState(0);

  const setTouchesAction = useTouchesAction(threshold);
  const onTouch: TouchEventHandler = useCallback(evt => {
    if (evt.currentTarget.scrollTop > 0 || evt.type === 'touchcancel') {
      setTouches(undefined);
      return;
    }
    const touches = getTouches(evt, evt.type === 'touchend' ? true : undefined);
    setTouches(setTouchesAction(touches));
  }, []);

  useEffect(() => {
    if (touches === undefined || touches.length === 0) {
      setMove(0);
      return;
    }
    if (touches.every(({end}) => end)) {
      setMove(0);
      setTouches(undefined);
      return;
    }
    setMove(touches[touches.length - 1]?.offsetY ?? 0);
  }, [touches, threshold]);

  return {onTouch, move};
};

const usePtr = (
  move: number,
  threshold: number,
  fetch?: (...arg: unknown[]) => Promise<unknown>
) => {
  const [ptrStatus, ptrAction] = usePtrStatus();
  useEffect(() => {
    if (Math.floor(threshold - move) < 5) {
      ptrAction('fullfil');
      return;
    }
    if (move > 0) {
      ptrAction('move');
      return;
    }
    if (move === 0) {
      ptrAction('release');
      return;
    }
  }, [move]);
  useEffect(() => {
    if (ptrStatus.state === PtrStatus.Loading) {
      if (fetch)
        fetch().then(() => {
          ptrAction('done');
        });
      else ptrAction('done');
    }
  }, [ptrStatus]);
  return ptrStatus;
};

export default (props: React.PropsWithChildren<{ptrThreshold?: number}>) => {
  const {ptrThreshold = 0} = props;
  const threshold = ptrThreshold <= 0 ? 100 : ptrThreshold;
  const {onTouch, move} = useTouch(threshold);
  const f = () => {
    return new Promise(r => setTimeout(r, 1000));
  };
  const ptrStatus = usePtr(move, threshold, f);

  const onTouchEvent = useCallback(
    evt => {
      if (ptrStatus.state === PtrStatus.Loading) return;
      onTouch(evt);
    },
    [ptrStatus]
  );

  return (
    <div
      className="touch-ptr__touch-zone"
      onTouchStart={onTouchEvent}
      onTouchEnd={onTouchEvent}
      onTouchMove={onTouchEvent}
      // onTouchCancel={onTouchEvent}
      style={{transform: `translateY(${move}px)`}}
    >
      {props.children}
    </div>
  );
};

import React, {
  TouchEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';

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

const setTouchesAction = (
  touches: Touches
): React.SetStateAction<Touches | undefined> => prev => {
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
      break;
    }
    const {offsetY} = next[i];
    next[i] = {
      identifier,
      pageY,
      offsetY: Math.max(0, Math.min(Infinity, offsetY + pageY - next[i].pageY)),
      ...(end ? {end} : undefined),
    };
  }
  return next;
};

const useTouchesAction = () =>
  useCallback(touches => setTouchesAction(touches), []);

const useTouch = (threshold: number) => {
  const [touches, setTouches] = useState<Touches>();
  const [move, setMove] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  const setTouchesAction = useTouchesAction();
  const onTouch: TouchEventHandler = useCallback(evt => {
    if (evt.currentTarget.scrollTop > 0 || evt.type === 'touchcancel') {
      setTouches(undefined);
      setCancelled(true);
      return;
    }
    const touches = getTouches(evt, evt.type === 'touchend' ? true : undefined);
    setCancelled(false);
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
    setMove(touches.reduce((sum, {offsetY}) => sum + offsetY, 0));
  }, [touches, threshold]);

  return {onTouch, move, cancelled, touches};
};

export default useTouch;

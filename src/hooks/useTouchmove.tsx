import {TouchEventHandler, useCallback, useEffect, useState} from 'react';

type PageX = number;
type OffsetX = number;
type PageY = number;
type OffsetY = number;
type Touches = {
  identifier: number;
  pageX: PageX;
  offsetX: OffsetX;
  pageY: PageY;
  offsetY: OffsetY;
  end?: true;
}[];

const getTouches = (evt: React.TouchEvent<Element>, end?: boolean) => {
  const ongoingTouches: Touches = [];
  for (let i = 0; i < evt.changedTouches.length; i++) {
    const {identifier, pageY, pageX} = evt.changedTouches.item(i);
    ongoingTouches[i] = {
      identifier,
      pageX,
      offsetX: 0,
      pageY,
      offsetY: 0,
      ...(end ? {end} : undefined),
    };
  }
  return ongoingTouches;
};

const setTouchesAction =
  (touches: Touches): React.SetStateAction<Touches | undefined> =>
  prev => {
    if (prev === undefined) return touches;
    const next: Touches = [...prev];
    for (const {identifier, pageX, pageY, end} of touches) {
      const i = next.findIndex(p => p.identifier === identifier);
      if (i === -1) {
        next.push({
          identifier,
          pageX,
          pageY,
          offsetX: 0,
          offsetY: 0,
          ...(end ? {end} : undefined),
        });
        break;
      }
      const {offsetX, offsetY} = next[i];
      next[i] = {
        identifier,
        pageX,
        pageY,
        offsetX: Math.min(Infinity, offsetX + pageX - next[i].pageX),
        offsetY: Math.min(Infinity, offsetY + pageY - next[i].pageY),
        ...(end ? {end} : undefined),
      };
    }
    return next;
  };

/**
 *
 * Get the touch moved position.
 * To avoid the native browser pull-to-refresh function, it need a class name to set body style overflow to hidden when move item.
 * The onTouch event in the return object must bind to onTouchstart, onTouchend, onTouchmove and onTouchcancel events.
 * @param ofHiddenClass The class name to set body style overflow to hidden
 */
export default function useTouchmove(ofHiddenClass = 'overflow-hidden') {
  const [touches, setTouches] = useState<Touches>();
  const [move, setMove] = useState({x: 0, y: 0});
  const [end, setEnd] = useState({x: 0, y: 0});
  const [cancelled, setCancelled] = useState(false);
  const [onMoving, setOnMoving] = useState(false);

  const [debug, setDebug] = useState<string>();

  const onTouch: TouchEventHandler = useCallback(evt => {
    setDebug(evt.type);
    if (evt.type === 'touchcancel') {
      setOnMoving(false);
      setCancelled(true);
      setTouches(undefined);
      return;
    }

    const touches = getTouches(evt, evt.type === 'touchend' ? true : undefined);
    setCancelled(false);
    setTouches(setTouchesAction(touches));
  }, []);

  useEffect(() => {
    if (touches === undefined || touches.length === 0) {
      setMove({x: 0, y: 0});
      setOnMoving(false);
      return;
    }
    const nextMove = touches.reduce(
      ({x, y}, {offsetY, offsetX}) => ({
        x: x + offsetX,
        y: y + offsetY,
      }),
      {x: 0, y: 0}
    );
    if (touches.every(({end}) => end)) {
      setEnd(nextMove);
      setMove({x: 0, y: 0});
      setTouches(undefined);
      setOnMoving(false);
      return;
    }
    setMove(nextMove);
    setOnMoving(true);
  }, [touches]);

  useEffect(() => {
    if (onMoving) {
      document.body.classList.add(ofHiddenClass);
    } else {
      document.body.classList.remove(ofHiddenClass);
    }
  }, [onMoving]);

  return {onTouch, move, end, cancelled, onMoving, debug};
}

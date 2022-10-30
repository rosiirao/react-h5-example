import React, {useEffect, useRef, useState} from 'react';
import './Card.scss';

import {useMounted} from '../../hooks/useMounted';
import useTouchmove from '../../hooks/useTouchmove';
import classNames from 'classnames';

let cards = (c => {
  return new Array(c).fill(0).map((_, i) => ({
    i,
    v: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium et
        quisquam veniam quam eum amet numquam eos! Dolorum molestiae beatae
        voluptatibus optio ipsum.`,
  }));
})(9);

/**
 *
 * @deprecated The position is computed by document.elementFromPoint method
 */
const createIntersectionObserver = (target: HTMLElement) => {
  const observer = new globalThis.IntersectionObserver(
    entries => {
      const isIntersecting = entries.find(e => e.isIntersecting === false);
      if (!isIntersecting) return;
    },
    {
      root: target,
      rootMargin: '10px',
      threshold: 0.8,
    }
  );
  return observer;
};

// const MovingCard = createContext<HTMLElement | undefined>(undefined);
// const MovableCardItem = forwardRef(CardItem);
const MovableCardItem = CardItem;

export default function Card() {
  const mounted = useMounted();
  const observer = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    if (mounted.current) {
      observer.current = createIntersectionObserver(
        document.querySelector('.card-list') as HTMLElement
      );
      for (const el of document.querySelectorAll('.card')) {
        observer.current.observe(el);
      }
    }
    return () => {
      if (!mounted.current && observer.current !== null) {
        observer.current.disconnect();
      }
    };
  }, [mounted]);
  useEffect(() => {
    if (mounted.current) {
      console.log('card mounted');
    }
    return () => {
      if (!mounted.current) {
        console.log('card unmounted');
        // observer..disconnect();
      }
    };
  }, [mounted]);

  const [interimCard, setInterimCard] = useState<typeof cards>();
  const moveCard = function (el: HTMLElement, target: HTMLElement) {
    if (![...document.querySelectorAll('.card').values()].includes(target))
      return;
    const moved = Number(el.dataset['i']),
      rel = Number(target.dataset['i']);
    if (moved === rel || isNaN(moved) || isNaN(rel)) return;

    const showCard = interimCard ?? cards;
    const {cards: afterMoved} = showCard.reduce<{
      cards: typeof cards;
      insert: boolean;
    }>(
      ({cards: acc, insert}, c) => {
        if (c.i === moved) return {cards: acc, insert: true};
        if (c.i === rel && !insert) {
          const card = cards.find(({i}) => i === moved);
          if (card !== undefined) acc.push(card);
        }
        acc.push(c);
        if (c.i === rel && insert) {
          const insert = cards.find(({i}) => i === moved);
          if (insert !== undefined) acc.push(insert);
        }
        return {cards: acc, insert};
      },
      {cards: [], insert: false}
    );
    setInterimCard(afterMoved);
  };

  const moveCardCancel = function () {
    setInterimCard(undefined);
  };
  const moveCardConfirm = function () {
    if (interimCard !== undefined) cards = interimCard;
    setInterimCard(undefined);
  };

  const el = useRef<HTMLUListElement>(null);
  return (
    <ul
      className="card-list"
      onDragOver={() => console.log('dragover')}
      ref={el}
    >
      {(interimCard ?? cards).map(c => (
        <MovableCardItem
          key={c.i}
          data={c}
          moveCard={moveCard}
          moveCardConfirm={moveCardConfirm}
          moveCardCancel={moveCardCancel}
        ></MovableCardItem>
      ))}
    </ul>
  );
}

function CardItem(
  props: React.PropsWithChildren<{
    data: {i: number; v: string};
    moveCardConfirm?: () => void;
    moveCardCancel?: () => void;
    /**
     * Move el behind the previous
     */
    moveCard?: (
      el: HTMLElement,
      previous: HTMLElement,
      p?: 'before' | 'after'
    ) => void;
  }>
) {
  const mounted = useMounted();

  const {
    onTouch: onTouchEvent,
    move,
    end,
    onMoving,
    cancelled,
  } = useTouchmove();

  const [shadow, setShadow] = useState<{x: number; y: number; w: number}>();

  const timer = useTimer(100);

  useEffect(() => {
    if (!mounted.current || el.current === null) return;
    if (!onMoving) {
      setShadow(undefined);
      return;
    }
    setShadow({
      x: el.current.offsetLeft,
      y: el.current.offsetTop,
      w: el.current.offsetWidth,
    });
  }, [onMoving]);

  const [cardPosition, setCardPosition] = useState<{x: number; y: number}>();

  useEffect(() => {
    if (cancelled) {
      props.moveCardCancel?.();
      timer(); // call once again tags the prev timer cancelled
      setCardPosition(undefined);
      return;
    }

    if (!mounted.current || el.current === null) return;
    if (shadow === undefined) return;
    const {x, y} = onMoving ? move : end;
    if (Math.abs(x) < 50 && Math.abs(y) < 50) return;

    timer().then(data => {
      if (data === timer_cancelled) return;
      if (!mounted.current || shadowCard.current === null) return;
      setCardPosition(shadowCard.current.getBoundingClientRect());
    });
  }, [shadow, onMoving, move, end, cancelled]);

  useEffect(() => {
    if (!mounted.current || el.current === null) return;
    if (cardPosition === undefined) return;

    const {x: cx, y: cy} = cardPosition;
    // Minus 1 on position to get the outer element
    const target = document.elementFromPoint(cx - 1, cy - 1);
    if (el.current === target) {
      if (!onMoving) props.moveCardConfirm?.();
      return;
    }
    if (target !== null) {
      const {x, width} = target.getClientRects()[0];
      const p = cx > x + width / 2 ? 'before' : 'after';
      props.moveCard?.(el.current, target as HTMLElement, p);
    }
    if (!onMoving) props.moveCardConfirm?.();
  }, [cardPosition, props.moveCard, props.moveCardConfirm]);

  const el = useRef<HTMLLIElement | null>(null);
  const shadowCard = useRef<HTMLLIElement | null>(null);
  return (
    <>
      <li
        className={classNames('card', onMoving ? 'card--moving' : undefined)}
        ref={el}
        onTouchStartCapture={onTouchEvent}
        onTouchEndCapture={onTouchEvent}
        onTouchMoveCapture={onTouchEvent}
        onTouchCancel={onTouchEvent}
        data-i={props.data.i}
      >
        <p>{props.data.i + ' : ' + props.data.v}</p>
      </li>
      {onMoving && shadow !== undefined ? (
        <li
          className="card card--shadow"
          ref={shadowCard}
          style={{
            width: shadow.w + 'px',
            transform: `translate(calc(${move.x + shadow.x}px - 100vw), ${
              move.y + shadow.y
            }px)`,
          }}
        >
          <p>
            {props.data.i + ' : ' + props.data.v + ':' + JSON.stringify(move)}
          </p>
        </li>
      ) : null}
    </>
  );
}

function useTimer(ms: number) {
  const [timer] = useState({t: createTimer(ms)});
  return timer.t;
}

const timer_cancelled = Symbol('cancelled');
/**
 * createTimer() return a timer function
 * @param ms should not less than 10ms
 */
function createTimer(ms = 500) {
  ms = Math.max(10, ms);
  let p: NodeJS.Timeout;
  let ok: (value?: typeof timer_cancelled) => void;
  /**
   * timer() returns a promise will resolved ,
   * when it is called once again, the promise returned previous in time quota will be resolved with throttle_cancelled value
   */
  return function timer() {
    if (p !== undefined) {
      clearTimeout(p);
      ok(timer_cancelled);
    }
    const r = new Promise<typeof timer_cancelled | void>(r => (ok = r));
    p = setTimeout(() => void ok(), ms);
    return r;
  };
}

import React, {useCallback, useEffect} from 'react';
import useTouch from './useTouch';
import usePtrStatus, {PtrStatus} from './usePtrStatus';

import './TouchPtr.scss';
import Preloader from '../../components/Preloader';

const usePtr = (
  {move, cancelled}: {move: number; cancelled: boolean},
  threshold: number,
  loader?: (...arg: unknown[]) => Promise<unknown>
) => {
  const [ptrStatus, ptrAction] = usePtrStatus();
  useEffect(() => {
    if (cancelled) {
      ptrAction('cancel');
      return;
    }
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
  }, [move, cancelled]);
  useEffect(() => {
    if (ptrStatus.state === PtrStatus.Loading) {
      if (loader)
        loader().then(() => {
          ptrAction('done');
        });
      else ptrAction('done');
    }
  }, [ptrStatus]);
  return ptrStatus;
};

type TouchPtrProps = React.PropsWithChildren<{
  ptrThreshold?: number;
  preloader?: JSX.Element;
  loader?: () => Promise<void>;
}>;

export default (props: TouchPtrProps) => {
  const {ptrThreshold = 0, loader, preloader = <Preloader />} = props;
  const threshold = Math.min(Math.max(100, ptrThreshold), 160);
  const {onTouch, move, cancelled, touches} = useTouch(threshold);

  const ptrStatus = usePtr({move, cancelled}, threshold, loader);

  const onTouchEvent = useCallback(
    evt => {
      if (ptrStatus.state === PtrStatus.Loading) return;
      onTouch(evt);
    },
    [ptrStatus]
  );

  const touchOffset = ptrStatus.state === PtrStatus.Loading ? 0 : move;
  const ptrStatusName = PtrStatus[ptrStatus.state].toLowerCase();
  const indicatorRotate = ptrStatus.state === PtrStatus.Fullfil ? 225 : 45;
  const preloaderEl = ptrStatus.state === PtrStatus.Loading ? preloader : null;

  /**
   * firefox only trigger touch event on capturing phase
   */
  return (
    <div
      className="touch-ptr__container"
      onTouchStartCapture={onTouchEvent}
      onTouchEndCapture={onTouchEvent}
      onTouchMoveCapture={onTouchEvent}
      onTouchCancel={onTouchEvent}
    >
      <div
        className="touch-ptr__indicator touch-ptr-indicator__wrapper"
        style={{
          transform: `translate(-50%, calc(${
            touchOffset - threshold
          }px + 2rem))`,
        }}
      >
        <div
          className={`touch-ptr-indicator touch-ptr-indicator--${ptrStatusName}`}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            transition: 'transform 0.2s',
            transform: `rotate(${indicatorRotate}deg)`,
          }}
        ></div>
      </div>
      <div
        className="touch-ptr"
        style={{transform: `translateY(${touchOffset}px)`}}
      >
        {preloaderEl}
        {props.children}
      </div>
    </div>
  );
};

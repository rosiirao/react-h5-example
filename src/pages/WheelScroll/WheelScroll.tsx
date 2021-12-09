import React, {useMemo, useEffect, useRef, useState} from 'react';
import './WheelScroll.scss';
import debounce from 'lodash/debounce';

// intersectionObserver 可在元素显示时触发
const intersectionObserver = new globalThis.IntersectionObserver(entries => {
  // If intersectionRatio is 0, the target is out of view
  // and we do not need to do anything.
  if (entries[0].intersectionRatio <= 0) return;

  console.log('Loaded new items', entries[0].intersectionRatio);
});

const toTransformStyle = (scale: number, rotate: number) => ({
  scaleX: scale,
  scaleY: scale,
  rotateZ: rotate + 'deg',
});

const fromTransformStyle = (style: Record<string, number | string>) =>
  Object.entries(style)
    .map(([key, value]) => `${key}(${value})`)
    .join(' ');

/**
 * 输入缩放比例， 返回放大缩小转换值
 * @param scale
 */
const MAX_SCALE = 3;
type StyleProp = [scale: number, rotate: number];
const useTransformStyle = ([scale, rotate]: StyleProp) => {
  const [[currentScale, currentRotate], setStyle] = useState<StyleProp>([
    scale,
    rotate,
  ]);
  // 一个延迟恢复设置缩放最大值
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const setTransformStyle = (
    setAction: StyleProp | ((_prevStyle: StyleProp) => StyleProp)
  ) => {
    setStyle(prevStyle => {
      const [scale, rotate] =
        typeof setAction !== 'function' ? setAction : setAction(prevStyle);
      // 缩放比率大于最大值， 延迟设置为最大值
      if (scale > MAX_SCALE || scale < -MAX_SCALE) {
        if (timerRef.current !== undefined) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          setStyle([scale > MAX_SCALE ? MAX_SCALE : -MAX_SCALE, rotate]);
        }, 500);
      } else {
        if (timerRef.current !== undefined) {
          clearTimeout(timerRef.current);
        }
      }
      return [scale || 1, rotate];
    });
  };
  return [
    [currentScale, currentRotate],
    fromTransformStyle(toTransformStyle(currentScale, currentRotate)),
    setTransformStyle,
  ] as [StyleProp, string, React.Dispatch<React.SetStateAction<StyleProp>>];
};

/**
 * 鼠标滚动时放大活着缩小元素
 */
export default function WheelEvent() {
  const wheelBox = useRef<HTMLDivElement>(null);
  const wheelContent = useRef<HTMLDivElement>(null);
  const onWheel: React.WheelEventHandler = event => {
    // onWheel passive event, the preventDefault is ignored
    event.preventDefault();
    // let ratio = (Math.abs(event.deltaX) + Math.abs(event.deltaY)) / 2 *
    //   (((event.deltaX > 0 && event.deltaY < 0) || (event.deltaX < 0 && event.deltaY > 0)) ? -1 : 1);
    // setTransformStyle(([scale, rotate]: StyleProp) => [(scale + event.deltaY), rotate]);
  };

  const [[scale, rotate], transformStyle, setTransformStyle] =
    useTransformStyle([1, 0]);

  const debounceSetScale = useMemo(
    () =>
      debounce((scale: number) => {
        setTransformStyle(([, rotate]: StyleProp) => [scale, rotate]);
      }, 10),
    [setTransformStyle]
  );

  const [scrollBox, setScrollBox] = useState({h: 900, w: 3});
  const debounceSetRotateByScroll = useMemo(
    () =>
      debounce((top: number, left: number) => {
        setTransformStyle((/*_: StyleProp*/) => [
          (2 * left) / scrollBox.w + 1,
          (top / scrollBox.h) * 900,
        ]);
      }),
    [setTransformStyle, scrollBox]
  );
  const debounceSetRotate = useMemo(
    () =>
      debounce((top: number) => {
        setTransformStyle(([scale]: StyleProp) => [scale, top]);
      }, 10),
    [setTransformStyle]
  );
  const onScroll = (event: React.UIEvent) => {
    const top = event.currentTarget.scrollTop;
    const left = event.currentTarget.scrollLeft;
    debounceSetRotateByScroll(top, left);
    // setTransformStyle(([scale]: StyleProp) => [scale, (top / MAX_TOP) * 360]);
  };

  const smile = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (smile.current !== null) {
      intersectionObserver.observe(smile.current);
    }
    setScrollBox({
      h:
        (wheelContent.current?.offsetHeight ?? 900) -
        (wheelBox.current?.offsetHeight ?? 0),
      w:
        (wheelContent.current?.offsetWidth ?? 1) -
        (wheelBox.current?.offsetWidth ?? 0),
    });
    return () => {
      intersectionObserver.disconnect();
    };
  }, [wheelContent]);
  const onChangeRotate: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = event => {
    debounceSetRotate(Number(event.currentTarget.value));
  };
  const onChangeScale: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = event => {
    debounceSetScale(Number(event.currentTarget.value));
  };
  // useLayoutEffect(() => {
  //   const wheelBoxDiv = wheelBox.current;
  //   const onScroll = (event: Event) => {
  //     event.preventDefault();
  //     const top = (event.currentTarget as HTMLDivElement).scrollTop;
  //     debounceSetRotate(top);
  //     // setTransformStyle(([scale]: StyleProp) => [scale, (top / MAX_TOP) * 360]);
  //   };
  //   wheelBoxDiv?.addEventListener('scroll', onScroll, { passive: true });
  //   return () => {
  //     wheelBoxDiv?.removeEventListener('scroll', onScroll);
  //   }
  // });
  return (
    <>
      <div className="wheel-box" ref={wheelBox} onScroll={onScroll}>
        <div className="smile" ref={smile} style={{transform: transformStyle}}>
          🤓
        </div>
        <div className="wheel-content" onWheel={onWheel} ref={wheelContent}>
          TOP
        </div>
      </div>
      <form name="smile-control" className="smile-control">
        <input
          type="range"
          name="smile-rotate"
          className="smile-rotate"
          min="-900"
          max="900"
          step="1"
          onChange={onChangeRotate}
          value={rotate}
        ></input>
        <input
          type="range"
          name="smile-scale"
          className="smile-scale"
          min="0.3"
          max="3"
          step="0.1"
          onChange={onChangeScale}
          value={scale}
        ></input>
      </form>
    </>
  );
}

/**
 * use location.state.page number settled in ViewLink to determine animating transition page's view  when nav
 * scroll element must be bind to body, so that transition can adjust the exit element position if there is scrolled
 */

import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {match, useLocation} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';
import classNames from 'classnames';

import './ViewTransition.scss';

/**
 *
 * get whether the view is from back or forward by the number of state.page
 */
const useBackState = (pageState: {page?: number}) => {
  const [prevPage, setPrevPage] = useState(0);
  const [back, setBack] = useState(false);
  if (prevPage > (pageState?.page ?? 0) && back !== true) {
    setBack(true);
  }

  if (prevPage < (pageState?.page ?? 0) && back !== false) {
    setBack(false);
  }
  if (prevPage !== (pageState?.page ?? 0)) {
    setPrevPage(pageState?.page ?? 0);
  }
  return back;
};

export default function ViewTransition(
  props: React.PropsWithChildren<{
    animate?: boolean;
    backAnimate?: boolean;
    viewClass?: string | Record<string, boolean> | Array<string>;
    match: match<{[x: string]: string | undefined}> | null;
  }>
) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation<{page: number}>();
  const back = useBackState(location.state);
  const [hidden, setHidden] = useState(false);

  const hide = useCallback(() => {
    setHidden(true);
  }, []);
  const show = useCallback(() => {
    setHidden(false);
  }, []);

  // get the position of the exit element if there is scrolled
  const [top, setTop] = useState(0);
  const onEnter = useCallback(() => {
    // show before enter animation start
    show();
    if (ref.current === null) return;
    const top = ref.current.dataset['top'] ?? 0;
    console.log(ref.current.className);
    console.log('scrollTo:', top);
    document.documentElement.scrollTo(0, Number(top));
    ref.current.style.removeProperty('top');
  }, [show]);

  const onEntered = useCallback(() => {
    // if animate=false,  only onEntered of Enter event is triggered
    show();
  }, [show]);

  const onExit = useCallback(() => {
    setTop(document.documentElement.scrollTop);
  }, [setTop]);

  const onExited = useCallback(() => {
    hide();
    if (ref.current === null) return;
    // delete ref.current.dataset['top'];
  }, [hide]);

  const transitionClass = `view-fade-${back ? 'right' : 'left'}`;
  const animate = back ? props.backAnimate ?? false : props.animate ?? true;

  // set exit element position and enter view scroll position
  const exitSelector =
    '.view-fade-left-exit-active, .view-fade-right-exit-active';
  useLayoutEffect(() => {
    if (ref.current === null) return;
    const enter =
      ref.current.classList.contains('view-fade-left-enter-active') ||
      ref.current.classList.contains('view-fade-right-enter-active');

    const exit =
      ref.current.classList.contains('view-fade-left-exit-active') ||
      ref.current.classList.contains('view-fade-right-exit-active');
    if (enter) {
      document.documentElement.scrollTo(0, top);
      const exitElement = document.querySelector<HTMLDivElement>(exitSelector);
      if (exitElement === null || exitElement.dataset['top'] === undefined)
        return;
      exitElement.style.top = top - Number(exitElement.dataset['top']) + 'px';
    }
    if (exit) {
      const scrollTop = document.documentElement.scrollTop;
      document.documentElement.scrollTo(0, top);
      if (scrollTop !== top) {
        ref.current.style.top = scrollTop - top + 'px';
      } else {
        // ref.current.dataset['top'] = top.toString();
      }
    }
    return () => {
      // document.querySelectorAll<HTMLDivElement>(exitSelector).forEach(e => {
      //   e.style.removeProperty('top');
      // });
    };
  }, [top]);
  return (
    <CSSTransition
      in={props.match !== null}
      appear={true}
      nodeRef={ref}
      classNames={transitionClass}
      timeout={3000}
      mountOnEnter
      unmountOnExit={false}
      enter={animate}
      exit={animate}
      onEnter={onEnter}
      onEntered={onEntered}
      onExit={onExit}
      onExited={onExited}
    >
      <div
        ref={ref}
        className={classNames('view-fade', props.viewClass)}
        hidden={hidden}
        data-top={top}
      >
        {props.children}
      </div>
    </CSSTransition>
  );
}

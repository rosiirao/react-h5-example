// import {useReducer} from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import './TouchPtr.scss';
import TouchZone from '../../components/TouchPtr';
import InfiniteScroll from '../../components/InfiniteScroll';

export default function () {
  const [data, setData] = useState([{count: 0, date: new Date()}]);
  const loaderId = useRef<number>();
  const loader = useCallback(async () => {
    return new Promise<void>(r => {
      loaderId.current = window.setTimeout(() => {
        setData(data => [
          ...data,
          {
            count: data[data.length - 1].count + 1,
            date: new Date(),
          },
        ]);
        r();
      }, 1000);
    });
  }, [setData]);

  useEffect(() => {
    return () => {
      clearTimeout(loaderId.current);
    };
  }, []);

  const contentMore = data[data.length - 1].count < 40;

  const content = (
    <>
      <p className="ptr__top">artificial top</p>
      <section className="ptr__content">
        <h3>artificial content</h3>
        <article>
          {data.map(({count, date}) => (
            <p key={count}>
              {count} : {date.toLocaleString() + '.' + date.getMilliseconds()}
            </p>
          ))}
        </article>
      </section>
      <p className="ptr__bottom">artificial bottom</p>
    </>
  );

  const scrollLoadingContent = (
    <InfiniteScroll loader={loader}>{content}</InfiniteScroll>
  );

  return (
    <article className="ptr__layout">
      <header>
        <h2>Touch pull to refresh</h2>
      </header>
      <section className="ptr__content">
        {/* <h3>PtrStatus:{PtrStatus[ptr.state]}</h3> */}
        <TouchZone loader={loader}>
          {contentMore ? scrollLoadingContent : content}
        </TouchZone>
      </section>
    </article>
  );
}

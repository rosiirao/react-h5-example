// import {useReducer} from 'react';
import './TouchPtr.scss';
import './TouchZone';
import TouchZone from './TouchZone';

export default function () {
  // const [ptr, send] = usePtr();

  // console.log('abcde');
  return (
    <article className="touch-ptr__layout">
      <header>
        <h2>Touch pull to refresh</h2>
      </header>
      <section className="touch-ptr">
        {/* <h3>PtrStatus:{PtrStatus[ptr.state]}</h3> */}
        <TouchZone>
          <p className="touch-ptr__content">artificial content</p>
        </TouchZone>
      </section>
    </article>
  );
}

/**
 * window.print() won't print css background color
 * hide no print element to avoid to print element overlap
 */

import React, {useRef} from 'react';
import './PrintPages.scss';

const print = (el: HTMLElement) => {
  const cloned = el.cloneNode(true) as HTMLElement;
  cloned.classList.add('print-zone');
  document.body.append(cloned);
  window.print();
  cloned.remove();
};

export default () => {
  const length = 15;
  const contents = new Array(length).fill(0);
  const mapToParagraph = (_: unknown, i: number) => (
    <p key={i}>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi ad quia
      esse eius dicta labore, eveniet et. Cum aspernatur suscipit autem itaque
      obcaecati perspiciatis consectetur rem quidem quasi molestias ullam iste
      enim repudiandae quod sequi perferendis illum repellat fugit, earum sint
      sunt odit tempora. Consequuntur minus iure delectus, voluptas eius dolores
      nemo culpa consequatur voluptatum, expedita harum tenetur! Nobis quisquam
      voluptatibus aut in quaerat aperiam. Mollitia debitis est saepe deleniti
      repudiandae, accusamus suscipit amet incidunt excepturi ipsum, eum nam
      placeat vero iste hic dolore impedit! Ab, ullam natus molestiae ea maxime
      debitis blanditiis nobis. Cumque eos nobis incidunt odit sapiente.
    </p>
  );

  const printZone = useRef<HTMLDivElement>(null);
  const onClickPrint: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (printZone.current !== null) print(printZone.current);
  };
  return (
    <>
      <button type="button" onClick={onClickPrint}>
        print
      </button>
      <div className="print-pages" ref={printZone}>
        {contents.length}
        {contents.map(mapToParagraph)}
        <p>100</p>
      </div>
    </>
  );
};

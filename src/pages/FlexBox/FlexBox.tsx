import './FlexBox.scss';

function FlexBox() {
  const contents = ['one item', 'two item', 'three item'];
  return (
    <div className="flex-box">
      {contents.map((c, i) => (
        <div key={i} className="flex-box__item flex-box__item--33">
          {c}
        </div>
      ))}
      <div className="flex-box__item flex-box__item--66 flex-box__item--80--large">
        four item
      </div>
      <div className="flex-box__item flex-box__item--33">five item</div>
    </div>
  );
}

export default FlexBox;

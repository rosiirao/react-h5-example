import './CSSEnv.scss';

export default () => {
  return (
    <div className="css-env__outer">
      <div className="css-env">
        <p>outer padding with env(safe-area-inset-*)</p>
      </div>
    </div>
  );
};

import './ColorScheme.scss';

export default () => {
  return (
    <>
      <header>
        <h2>color theme</h2>
      </header>
      <section>
        <p className="color-examples">
          <span className="brand rad-shadow">1</span>
          <span className="text-1">2</span>
          <span className="text-2">3</span>
          <span className="surface-1">4</span>
          <span className="surface-2">5</span>
          <span className="surface-3">6</span>
          <span className="surface-4">7</span>
          <span className="surface-shadow">8</span>
          <span className="shadow-strength">9</span>
        </p>
      </section>
    </>
  );
};

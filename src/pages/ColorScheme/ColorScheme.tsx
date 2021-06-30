import './ColorScheme.scss';

export default () => {
  return (
    <article>
      <header>
        <h2>color scheme</h2>
      </header>
      <section>
        <p className="color-examples">
          <span className="brand rad-shadow"></span>
          <span className="text-1"></span>
          <span className="text-2"></span>
          <span className="surface-1"></span>
          <span className="surface-2"></span>
          <span className="surface-3"></span>
          <span className="surface-4"></span>
          <span className="surface-shadow"></span>
          <span className="shadow-strength"></span>
        </p>
      </section>
    </article>
  );
};

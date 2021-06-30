/**
 * Theme switch button
 * @param {theme, toggle}
 * @returns
 */
export default (function ThemeSwitch({theme, toggle}) {
  return typeof toggle === 'function' ? (
    <label>
      Theme:
      <button onClick={toggle} role="switch" type="button">
        {theme}
      </button>
    </label>
  ) : null;
} as React.FC<{
  theme: string;
  toggle?: React.MouseEventHandler<HTMLButtonElement>;
}>);

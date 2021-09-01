/**
 * Theme switch button
 * @param {theme, toggle}
 * @returns
 */
export default (function ThemeSwitch({theme, toggle}) {
  return typeof toggle === 'function' ? (
    <label
      style={{
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        minWidth: '6.8em',
      }}
    >
      Theme:
      <button onClick={toggle} type="button">
        {theme}
      </button>
    </label>
  ) : null;
} as React.FC<{
  theme: string;
  toggle?: React.MouseEventHandler<HTMLButtonElement>;
}>);

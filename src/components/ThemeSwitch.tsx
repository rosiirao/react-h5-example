/**
 * Theme switch button
 * @param {on, toggle}
 * @returns
 */
export default (function ThemeSwitch({on, toggle}) {
  return typeof toggle === 'function' ? (
    <button
      onClick={toggle}
      role="switch"
      type="button"
      aria-checked={(on = on === true)}
    >
      {on === true ? 'on' : 'off'}
    </button>
  ) : null;
} as React.FC<{
  on: boolean;
  toggle?: React.MouseEventHandler<HTMLButtonElement>;
}>);

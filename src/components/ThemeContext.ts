import React, {useState} from 'react';

export enum Theme {
  light = 0b001,
  dark = 0b010,
  dim = 0b100,
}

export const themes = {
  [Theme.light]: {
    color: 'hsl(0, 0%, 0%)',
    background: 'hsl(0, 0%, 93%)',
  },
  [Theme.dark]: {
    color: 'hsl(0, 0%, 100%)',
    background: 'hsl(0, 0%, 13%)',
  },
  [Theme.dim]: {
    color: 'hsl(0, 0%, 85%)',
    background: 'hsl(0, 0%, 20%)',
  },
};

const toggle = (prevTheme?: Theme) => {
  if (prevTheme === undefined) {
    return Theme.light;
  }
  const theme = prevTheme << 1;
  if (theme in Theme) {
    return theme;
  }
  return undefined;
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>();

  const _toggle = (prevTheme?: Theme) => {
    const nextTheme = toggle(prevTheme);
    setTheme(nextTheme);
    return nextTheme;
  };
  return [theme, _toggle] as const;
};

export default React.createContext([
  undefined as Theme | undefined,
  toggle,
] as const);

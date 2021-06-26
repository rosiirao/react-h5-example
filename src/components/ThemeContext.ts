import React, {useState} from 'react';

export enum Theme {
  light,
  dark,
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
};

const toggle = (prevTheme: Theme) => {
  return ~(prevTheme as number) as Theme;
};

export const useTheme = () => {
  const [theme, setTheme] = useState(Theme.light);

  const _toggle = (prevTheme: Theme) => {
    const nextTheme = toggle(prevTheme);
    setTheme(nextTheme);
    return ~(prevTheme as number) as Theme;
  };
  return [theme as Theme, _toggle] as const;
};

export default React.createContext([Theme.light as Theme, toggle] as const);

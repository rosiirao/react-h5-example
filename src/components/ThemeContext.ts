import React from 'react';

export enum Theme {
  light,
  dark,
}

export const themes = {
  [Theme.light]: {
    color: '#000000',
    background: '#eeeeee',
  },
  [Theme.dark]: {
    color: '#ffffff',
    background: '#222222',
  },
};

export const toggle = (theme: Theme) => {
  return ~(theme as number) as Theme;
};

export default React.createContext(Theme.light);

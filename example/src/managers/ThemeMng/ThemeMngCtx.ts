import { createContext } from 'react';

import { TThemeMngSt } from './types';

export const ThemeMngCtx = createContext<TThemeMngSt>({
  theme: 'dark',
  systemTheme: 'dark',
  toggle: ()=>{},
  setTheme: () => {},
});

export default ThemeMngCtx;

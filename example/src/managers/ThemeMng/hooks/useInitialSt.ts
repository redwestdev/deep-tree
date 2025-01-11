import { useCallback, useContext, useLayoutEffect } from 'react';

import { TAppTheme, TThemeMngSt } from '../types';

import ThemeMngCtx from '../ThemeMngCtx';

import useLocalStorage from 'use-local-storage';
import useSystemTheme from 'managers/ThemeMng/hooks/useSystemTheme';

export const useThemeMng = () =>
  useContext(ThemeMngCtx);


const THEMES_ORDER: TAppTheme[] = ['light', 'dark', 'system'];

export default function useInitialSt(): TThemeMngSt {
  const [theme, setTheme] = useLocalStorage<TAppTheme>('app-theme', 'system');
  const systemTheme = useSystemTheme();

  const toggle = useCallback(() => {
    setTheme((currentTheme) => {
      const currentIndex = THEMES_ORDER.indexOf(currentTheme ?? systemTheme);
      const nextIndex = (currentIndex + 1) % THEMES_ORDER.length;
      return  THEMES_ORDER[nextIndex];

    });
  }, [setTheme, systemTheme]);

  useLayoutEffect(()=>{
    document.body.classList.remove(...THEMES_ORDER);
    document.body.classList.add(theme);// new theme
  },[theme])


  return {
    theme,
    setTheme,
    toggle,
    systemTheme
  };
}

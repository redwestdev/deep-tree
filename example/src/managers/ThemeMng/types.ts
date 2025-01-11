import React from 'react';

export type TThemeMngSt = {
  theme: TAppTheme;
  systemTheme: TAppTheme;
  setTheme: React.Dispatch<React.SetStateAction<TAppTheme | undefined>>;
  toggle(): void;
};

export type TAppTheme = 'light' | 'dark' | 'system';

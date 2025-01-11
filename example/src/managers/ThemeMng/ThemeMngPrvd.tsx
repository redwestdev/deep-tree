import React from 'react';

import useInitialSt from './hooks/useInitialSt';

import ThemeMngCtx from './ThemeMngCtx';


interface TThemeMngPrvdProps {
  children: React.ReactNode;
}

export default function ThemeMngPrvd({
                                       children,
                                     }: TThemeMngPrvdProps) {
  const value = useInitialSt();
  return (
    <ThemeMngCtx.Provider
      value={value}
    >
      {children}
    </ThemeMngCtx.Provider>
  );
}

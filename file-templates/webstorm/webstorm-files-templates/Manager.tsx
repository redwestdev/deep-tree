import React from 'react';

import useInitialSt from './useInitialSt';

import ${NAME}Ctx from './${NAME}Ctx';


interface T${NAME}PrvdProps {
  children: React.ReactNode;
}

export default function ${NAME}Prvd({
  children,
}: T${NAME}PrvdProps) {
  const value = useInitialSt()
  return (
    <${NAME}Ctx.Provider
      value={value}
    >
      {children}
    </${NAME}Ctx.Provider>
  );
}

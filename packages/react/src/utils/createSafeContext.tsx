import { createContext, useContext } from 'react';

export function createSafeContext<T>(displayName: string) {
  const Context = createContext<T | null>(null);
  Context.displayName = displayName;

  function useCtx(): T {
    const value = useContext(Context);
    if (value === null) throw new Error(`${displayName}: no provider`);
    return value;
  }

  return [Context, useCtx] as const;
}

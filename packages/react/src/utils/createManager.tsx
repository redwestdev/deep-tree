import { type ReactNode } from 'react';

import { createSafeContext } from './createSafeContext.js';

export function createManager<T>(
  useController: () => T,
  renderOwn?: (value: T) => ReactNode,
  displayName?: string
) {
  const [Context, useCtx] = createSafeContext<T>(displayName ?? 'Manager');

  function Provider({ children }: { children: ReactNode }) {
    const value = useController();
    return (
      <Context.Provider value={value}>
        {children}
        {renderOwn?.(value)}
      </Context.Provider>
    );
  }

  return [Provider, useCtx] as const;
}

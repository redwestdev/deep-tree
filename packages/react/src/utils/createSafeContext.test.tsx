import { createElement } from 'react';

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { createSafeContext } from './createSafeContext.js';

describe('createSafeContext', () => {
  it('returns a tuple of [Context, useCtx]', () => {
    const result = createSafeContext<string>('Test');
    expect(result).toHaveLength(2);
    expect(typeof result[1]).toBe('function');
  });

  it('sets displayName on the context', () => {
    const [Context] = createSafeContext<string>('MyContext');
    expect(Context.displayName).toBe('MyContext');
  });

  it('throws when used outside provider', () => {
    const [, useCtx] = createSafeContext<string>('TestContext');
    expect(() => renderHook(() => useCtx())).toThrow(
      'TestContext: no provider'
    );
  });

  it('returns value when inside provider', () => {
    const [Context, useCtx] = createSafeContext<{ name: string }>(
      'TestContext'
    );
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(
        Context.Provider,
        { value: { name: 'deep-tree' } },
        children
      );

    const { result } = renderHook(() => useCtx(), { wrapper });
    expect(result.current.name).toBe('deep-tree');
  });
});

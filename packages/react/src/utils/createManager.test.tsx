import { createElement } from 'react';

import { render, renderHook, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { createManager } from './createManager.js';

const useController = () => ({ count: 42 });

describe('createManager', () => {
  it('returns a tuple of [Provider, useCtx]', () => {
    const result = createManager(useController);
    expect(result).toHaveLength(2);
  });

  it('throws when used outside provider', () => {
    const [, useCtx] = createManager(useController, undefined, 'TestMng');
    expect(() => renderHook(() => useCtx())).toThrow('TestMng: no provider');
  });

  it('provides controller value via hook', () => {
    const [Provider, useCtx] = createManager(
      useController,
      undefined,
      'TestMng'
    );
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(Provider, null, children);

    const { result } = renderHook(() => useCtx(), { wrapper });
    expect(result.current.count).toBe(42);
  });

  it('renders children', () => {
    const [Provider] = createManager(useController);
    render(
      createElement(
        Provider,
        null,
        createElement('div', { 'data-testid': 'child' })
      )
    );
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('renders own UI via renderOwn', () => {
    const [Provider] = createManager(useController, (ctrl) =>
      createElement('div', { 'data-testid': 'own-ui' }, String(ctrl.count))
    );
    render(createElement(Provider, null, null));
    expect(screen.getByTestId('own-ui').textContent).toBe('42');
  });

  it('works without renderOwn', () => {
    const [Provider, useCtx] = createManager(useController);
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(Provider, null, children);

    const { result } = renderHook(() => useCtx(), { wrapper });
    expect(result.current.count).toBe(42);
  });
});

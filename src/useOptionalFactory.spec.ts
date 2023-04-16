import { renderHook } from '@testing-library/react';
import { useOptionalFactory } from './useOptionalFactory';

const factory = (): number => Math.random();

describe('uesOptionalFactory', () => {
  it('returns a value', () => {
    const { result, rerender } = renderHook(
      (props) => useOptionalFactory(...props),
      { initialProps: [123] as [number] },
    );

    expect(result.current).toBe(123);
    rerender([456]);
    expect(result.current).toBe(456);
  });

  it('return a function', () => {
    const { result, rerender } = renderHook(
      (props) => useOptionalFactory(...props),
      { initialProps: [factory, []] as const },
    );

    const value = result.current;
    expect(result.current).toBe(value);
    rerender([factory, []]);
    expect(result.current).toBe(value);
  });
});

import { act, renderHook } from '@testing-library/react';

import { useIterable } from './useIterable';

test('useIterable', () => {
  const { result } = renderHook((props) => useIterable(...props), {
    initialProps: ['abc'] as const,
  });

  expect(result.current.value).toBe('a');
  expect(result.current.done).toBe(false);
  act(() => result.current.next());

  expect(result.current.value).toBe('b');
  expect(result.current.done).toBe(false);
  act(() => result.current.next());

  expect(result.current.value).toBe('c');
  expect(result.current.done).toBe(false);
  act(() => result.current.next());

  expect(result.current.value).toBeUndefined();
  expect(result.current.done).toBe(true);
});

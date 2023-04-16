import { act, renderHook } from '@testing-library/react';

import { useAsyncIterable } from './useAsyncIterable';

test('useAsyncIterable', async () => {
  const { result } = renderHook((props) => useAsyncIterable(...props), {
    initialProps: [
      async function* () {
        yield 'a';
        yield 'b';
        yield 'c';
      },
      [],
    ] as const,
  });

  await act(() => result.current.next());
  expect(result.current.value).toBe('a');
  expect(result.current.done).toBe(false);

  await act(() => result.current.next());
  expect(result.current.value).toBe('b');
  expect(result.current.done).toBe(false);

  await act(() => result.current.next());
  expect(result.current.value).toBe('c');
  expect(result.current.done).toBe(false);

  await act(() => result.current.next());
  expect(result.current.value).toBeUndefined();
  expect(result.current.done).toBe(true);
});

import { act, renderHook } from '@testing-library/react';

import { useAsyncGenerator } from './useAsyncGenerator';

async function* generator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

test('useAsyncGenerator', async () => {
  const { result } = renderHook(
    (props) => useAsyncGenerator<string>(...props),
    { initialProps: [generator, []] as const },
  );

  await act(result.current.next);
  expect(result.current.value).toBe('a');
  expect(result.current.done).toBe(false);

  await act(result.current.next);
  expect(result.current.value).toBe('b');
  expect(result.current.done).toBe(false);

  await act(result.current.next);
  expect(result.current.value).toBe('c');
  expect(result.current.done).toBe(false);

  await act(result.current.next);
  expect(result.current.value).toBeUndefined();
  expect(result.current.done).toBe(true);
});

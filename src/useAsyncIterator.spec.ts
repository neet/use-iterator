import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useAsyncIterator } from './useAsyncIterator';

const asyncIterator = async function* () {
  yield 'a';
  yield 'b';
  yield 'c';
};

test('useAsyncIterator', async () => {
  const { result } = renderHook((prop) => useAsyncIterator<string>(prop), {
    initialProps: asyncIterator(),
  });

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

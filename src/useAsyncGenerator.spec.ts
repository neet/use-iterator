import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useAsyncGenerator } from './useAsyncGenerator';

test('useAsyncGenerator', async () => {
  const { result, waitForNextUpdate } = renderHook((p) => useAsyncGenerator(...p), {
    initialProps: [
      async function* () {
        yield 'a';
        yield 'b';
        yield 'c';
      },
      [],
    ] as const,
  });

  act(result.current.next);
  await waitForNextUpdate();
  expect(result.current.value).toBe('a');
  expect(result.current.done).toBe(false);

  act(result.current.next);
  await waitForNextUpdate();
  expect(result.current.value).toBe('b');
  expect(result.current.done).toBe(false);

  act(result.current.next);
  await waitForNextUpdate();
  expect(result.current.value).toBe('c');
  expect(result.current.done).toBe(false);

  act(result.current.next);
  await waitForNextUpdate();
  expect(result.current.value).toBeUndefined();
  expect(result.current.done).toBe(true);
});

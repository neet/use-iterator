import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useGenerator } from './useGenerator';

test('useGenerator', () => {
  const { result } = renderHook((p) => useGenerator(...p), {
    initialProps: [
      function* () {
        yield 'a';
        yield 'b';
        yield 'c';
      },
      [],
    ] as const,
  });

  expect(result.current.value).toBe('a');
  expect(result.current.done).toBe(false);
  act(result.current.next);

  expect(result.current.value).toBe('b');
  expect(result.current.done).toBe(false);
  act(result.current.next);

  expect(result.current.value).toBe('c');
  expect(result.current.done).toBe(false);
  act(result.current.next);

  expect(result.current.value).toBeUndefined();
  expect(result.current.done).toBe(true);
});

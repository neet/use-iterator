import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useIterator } from './useIterator';

test('useIterable', () => {
  const { result } = renderHook(useIterator, {
    initialProps: (function* () {
      yield 'a';
      yield 'b';
      yield 'c';
    })(),
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

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useIterable } from './useIterable';

test('useIterable', () => {
  const { result } = renderHook(useIterable, {
    initialProps: 'abc',
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

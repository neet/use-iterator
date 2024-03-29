import { renderHook, act, waitFor } from '@testing-library/react';

import { useForAwaitOf } from './useForAwaitOf';

const delay = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const asyncIterable = async function* () {
  await delay(1000);
  yield 'a';

  await delay(1000);
  yield 'b';

  await delay(1000);
  yield 'c';

  await delay(1000);
};

jest.useFakeTimers();

test('useForAwaitOf', async () => {
  const { result } = renderHook((prop) => useForAwaitOf<string>(prop), {
    initialProps: asyncIterable(),
  });

  expect(result.current.value).toBeUndefined();
  expect(result.current.loading).toBe(true);
  expect(result.current.done).toBe(false);

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  await waitFor(() => {
    expect(result.current.value).toBe('a');
    expect(result.current.loading).toBe(true);
    expect(result.current.done).toBe(false);
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  await waitFor(() => {
    expect(result.current.value).toBe('b');
    expect(result.current.loading).toBe(true);
    expect(result.current.done).toBe(false);
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  await waitFor(() => {
    expect(result.current.value).toBe('c');
    expect(result.current.loading).toBe(true);
    expect(result.current.done).toBe(false);
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  await waitFor(() => {
    expect(result.current.value).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.done).toBe(true);
  });
});

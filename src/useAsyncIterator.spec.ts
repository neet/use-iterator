import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useAsyncIterator } from './useAsyncIterator';

async function* asyncIterator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

async function* asyncIteratorThatThrowsAnError() {
  yield 'a';
  throw 'error';
}

const iteratorWithoutReturn: AsyncIterator<number, void, undefined> = {
  next: async () => {
    return { value: 0, done: false };
  },
};

describe('useAsyncIterator', () => {
  test('call next', async () => {
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

  test('async iterator that throws an error', async () => {
    const { result } = renderHook((prop) => useAsyncIterator<string>(prop), {
      initialProps: asyncIteratorThatThrowsAnError(),
    });

    await act(result.current.next);
    expect(result.current.value).toBe('a');
    expect(result.current.done).toBe(false);

    await act(result.current.next);
    expect(result.current.error).toBe('error');
    expect(result.current.done).toBe(false);
  });

  test('return manually', async () => {
    const { result } = renderHook(
      (prop) => useAsyncIterator<string, string, void>(prop),
      { initialProps: asyncIterator() as AsyncIterator<string, string, void> },
    );

    await act(result.current.next);
    expect(result.current.value).toBe('a');
    expect(result.current.done).toBe(false);

    await act(() => result.current.return('z'));
    expect(result.current.value).toBe('z');
    expect(result.current.done).toBe(true);
  });

  test('return behaves noop for iterators without return', async () => {
    const { result } = renderHook((prop) => useAsyncIterator<number>(prop), {
      initialProps: iteratorWithoutReturn,
    });

    await act(result.current.next);
    act(() => result.current.return());
    expect(result.current.value).toBe(0);
    expect(result.current.done).toBe(false);
  });

  test('throw behaves noop for iterators without throw', async () => {
    const { result } = renderHook((prop) => useAsyncIterator<number>(prop), {
      initialProps: iteratorWithoutReturn,
    });
    await act(result.current.next);

    expect(() => {
      act(() => result.current.throw('error'));
    }).not.toThrow();

    expect(result.current.value).toBe(0);
    expect(result.current.done).toBe(false);
  });

  test('throw manually', async () => {
    const { result } = renderHook(
      (prop) => useAsyncIterator<string, string, void>(prop),
      { initialProps: asyncIterator() as AsyncIterator<string, string, void> },
    );

    await act(result.current.next);
    expect(result.current.value).toBe('a');
    expect(result.current.done).toBe(false);

    await act(() => result.current.throw('z'));
    expect(result.current.error).toBe('z');
    expect(result.current.done).toBe(false);
  });
});

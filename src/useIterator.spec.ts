import { act, renderHook } from '@testing-library/react';

import { useIterator } from './useIterator';

function* iterable() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const iteratorWithoutReturn: Iterator<number, void, undefined> = {
  next: () => {
    return { value: 0, done: false };
  },
};

describe('useIterable', () => {
  test('next', () => {
    const { result } = renderHook((props) => useIterator<string>(props), {
      initialProps: iterable(),
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

  test('return', () => {
    const { result } = renderHook(
      (props) => useIterator<string, string, string>(props),
      { initialProps: iterable() as Iterator<string, string, string> },
    );

    expect(result.current.value).toBe('a');
    expect(result.current.done).toBe(false);

    act(() => result.current.return('z'));
    expect(result.current.value).toBe('z');
    expect(result.current.done).toBe(true);
  });

  test('return behaves noop for iterators without return', () => {
    const { result } = renderHook((props) => useIterator<number>(props), {
      initialProps: iteratorWithoutReturn,
    });

    act(() => result.current.return());
    expect(result.current.value).toBe(0);
    expect(result.current.done).toBe(false);
  });

  test('throw', () => {
    const { result } = renderHook(
      (props) => useIterator<string, string, string>(props),
      { initialProps: iterable() as Iterator<string, string, string> },
    );

    expect(result.current.value).toBe('a');
    expect(result.current.done).toBe(false);

    expect(() => {
      act(() => result.current.throw('error'));
    }).toThrow('error');

    expect(result.current.value).toBe('a');
    expect(result.current.done).toBe(false);
  });

  test('throw behaves noop for iterators without throw', () => {
    const { result } = renderHook((props) => useIterator<number>(props), {
      initialProps: iteratorWithoutReturn,
    });

    expect(() => {
      act(() => result.current.throw('error'));
    }).not.toThrow('error');

    expect(result.current.value).toBe(0);
    expect(result.current.done).toBe(false);
  });
});

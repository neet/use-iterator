import { DependencyList, useCallback, useMemo, useReducer } from 'react';
import { FactoryOrInstance } from './types';
import { useOptionalFactory } from './useOptionalFactory';

export interface BaseUseIteratorResponse<TReturn, TNext> {
  next: (...args: TNext extends void ? [] : [TNext]) => void;
  return: (arg: TReturn) => void;
  throw: (arg: unknown) => void;
}

export interface UseIteratorIncompleteResponse<T, TReturn, TNext>
  extends BaseUseIteratorResponse<TReturn, TNext> {
  done: false;
  value: Exclude<T | TReturn, void>;
}

export interface UseIteratorCompleteResponse<T, TReturn, TNext>
  extends BaseUseIteratorResponse<TReturn, TNext> {
  done: true;
  value: Exclude<T | TReturn, void>;
}

export type UseIteratorResponse<T, TReturn, TNext> =
  | UseIteratorIncompleteResponse<T, TReturn, TNext>
  | UseIteratorCompleteResponse<T, TReturn, TNext>;

type ReducerState<T, TReturn> = {
  value: T | TReturn;
  done?: boolean;
};

const reducer = <T, TReturn>(
  s: ReducerState<T, TReturn>,
  v: Partial<ReducerState<T, TReturn>> | undefined,
): ReducerState<T, TReturn> => {
  const next = { ...s, ...v };
  return next;
};

export const useIterator = <T, TReturn = void, TNext = void>(
  fn: FactoryOrInstance<Iterator<T, TReturn, TNext>>,
  deps?: DependencyList,
): UseIteratorResponse<T, TReturn, TNext> => {
  const iterator = useOptionalFactory(fn, deps);
  const initialState = useMemo(() => iterator.next(), []);
  const [result, update] = useReducer(reducer, initialState);

  const next = useCallback(
    (next?: TNext) => {
      const res = iterator.next(next as TNext);
      update(res);
    },
    [iterator, update],
  );

  const return_ = useCallback(
    (value: TReturn) => {
      const res = iterator.return?.(value);
      update(res);
    },
    [iterator, update],
  );

  const throw_ = useCallback(
    (error: unknown) => {
      iterator.throw?.(error);
    },
    [iterator, update],
  );

  return useMemo(
    () => ({
      done: result.done,
      value: result.value,
      next,
      return: return_,
      throw: throw_,
    }),
    [result, next, return_, throw_],
  ) as UseIteratorResponse<T, TReturn, TNext>;
};

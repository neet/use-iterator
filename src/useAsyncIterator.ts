import {
  DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { FactoryOrInstance } from './types';
import { useOptionalFactory } from './useOptionalFactory';

// --- reducer
type ReducerState<T, TReturn> = {
  value: T | TReturn | undefined;
  error: unknown | undefined;
  done: boolean;
  loading: boolean;
};

const reducer = <T, TReturn>(
  s: ReducerState<T, TReturn>,
  v: Partial<ReducerState<T, TReturn>>,
): ReducerState<T, TReturn> => {
  const next = { ...s, ...v };
  return next;
};

const initialState: ReducerState<unknown, unknown> = {
  value: undefined,
  error: undefined,
  done: false,
  loading: false,
};

// --- response
export interface BaseUseAsyncIteratorResponse<TReturn, TNext> {
  error?: unknown;
  next: (...args: TNext extends void ? [] : [TNext]) => Promise<void>;
  return: (arg: TReturn) => Promise<void>;
  throw: (arg: unknown) => Promise<void>;
}

export type UseAsyncIteratorLoadingIncompleteResponse<T, TReturn, TNext> =
  BaseUseAsyncIteratorResponse<TReturn, TNext> & {
    value: Exclude<T | TReturn, void> | undefined;
    loading: true;
    done: false;
  };

export type UseAsyncIteratorLoadingCompleteResponse<T, TReturn, TNext> =
  BaseUseAsyncIteratorResponse<TReturn, TNext> & {
    value: Exclude<T | TReturn, void>;
    loading: true;
    done: true;
  };

export type UseAsyncIteratorLoadedIncompleteResponse<T, TReturn, TNext> =
  BaseUseAsyncIteratorResponse<TReturn, TNext> & {
    value: Exclude<T | TReturn, void>;
    loading: false;
    done: false;
  };

export type UseAsyncIteratorLoadedCompleteResponse<T, TReturn, TNext> =
  BaseUseAsyncIteratorResponse<TReturn, TNext> & {
    value: Exclude<T | TReturn, void>;
    loading: false;
    done: true;
  };

export type UseAsyncIteratorResponse<T, TReturn, TNext> =
  | UseAsyncIteratorLoadingIncompleteResponse<T, TReturn, TNext>
  | UseAsyncIteratorLoadingCompleteResponse<T, TReturn, TNext>
  | UseAsyncIteratorLoadedIncompleteResponse<T, TReturn, TNext>
  | UseAsyncIteratorLoadedCompleteResponse<T, TReturn, TNext>;

// --- hook
export const useAsyncIterator = <T, TReturn = void, TNext = void>(
  fn: FactoryOrInstance<AsyncIterator<T, TReturn, TNext>>,
  deps?: DependencyList,
): UseAsyncIteratorResponse<T, TReturn, TNext> => {
  const asyncIterator = useOptionalFactory(fn, deps);
  const [result, update] = useReducer(reducer, initialState);

  useEffect(() => {
    update(initialState);
  }, [asyncIterator]);

  const next = useCallback(
    (arg?: TNext) => {
      update({ loading: true });

      return asyncIterator
        .next(arg as TNext)
        .then((r) => update({ value: r.value, done: r.done }))
        .catch((error) => update({ error }))
        .finally(() => update({ loading: false }));
    },
    [asyncIterator, update],
  );

  const return_ = useCallback(
    (value: TReturn) => {
      update({ loading: true });

      return asyncIterator
        .return?.(value)
        .then((r) => update({ value: r.value, done: r.done }))
        .finally(() => update({ loading: false }));
    },
    [asyncIterator, update],
  );

  const throw_ = useCallback(
    (value: unknown) => {
      update({ loading: true });

      return asyncIterator
        .throw?.(value)
        .catch((error) => update({ error }))
        .finally(() => update({ loading: false }));
    },
    [asyncIterator, update],
  );

  return useMemo(
    () => ({
      done: result.done,
      value: result.value,
      error: result.error,
      loading: result.loading,
      next,
      return: return_,
      throw: throw_,
    }),
    [result, next, return_, throw_],
  ) as UseAsyncIteratorResponse<T, TReturn, TNext>;
};

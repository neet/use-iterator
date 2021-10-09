import { useCallback, useEffect, useMemo, useReducer } from 'react';

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

// -- response
export interface BaseUseAsyncIteratorResponse<TReturn, TNext> {
  next: (...args: TNext extends undefined ? [] : [TNext]) => Promise<void>;
  return: (arg: TReturn) => Promise<void>;
  throw: (arg: unknown) => Promise<void>;
}

export type UseAsyncIteratorLoadingResponse<T, TReturn, TNext> =
  BaseUseAsyncIteratorResponse<TReturn, TNext> & {
    value: T | TReturn | undefined;
    loading: true;
    done: boolean;
    error?: unknown;
  };

export type UseAsyncIteratorLoadedResponse<T, TReturn, TNext> =
  BaseUseAsyncIteratorResponse<TReturn, TNext> & {
    value: T | TReturn;
    loading: false;
    done: boolean;
    error?: unknown;
  };

export type UseAsyncIteratorResponse<T, TReturn, TNext> =
  | UseAsyncIteratorLoadingResponse<T, TReturn, TNext>
  | UseAsyncIteratorLoadedResponse<T, TReturn, TNext>;

export const useAsyncIterator = <T, TReturn = void, TNext = undefined>(
  asyncIterator: AsyncIterator<T, TReturn, TNext>,
): UseAsyncIteratorResponse<T, TReturn, TNext> => {
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
        .catch((error) => update({ error }))
        .finally(() => update({ loading: false }));
    },
    [asyncIterator, update],
  );

  const throw_ = useCallback(
    (value: unknown) => {
      update({ loading: true });

      return asyncIterator
        .throw?.(value)
        .then((r) => update({ value: r.value, done: r.done }))
        .catch((error) => update({ error }))
        .finally(() => update({ loading: false }));
    },
    [asyncIterator, update],
  );

  return useMemo(
    () => ({
      done: result.done,
      value: result.value,
      loading: result.loading,
      next,
      return: return_,
      throw: throw_,
    }),
    [result, next, return_, throw_],
  ) as UseAsyncIteratorResponse<T, TReturn, TNext>;
};

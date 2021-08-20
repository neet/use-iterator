import { useCallback, useDebugValue, useReducer } from "react";
import { UseIteratorResponse } from "./useIterator";

// --- reducer 
type ReducerState<T, TReturn> = {
  value: T | TReturn | undefined;
  error: unknown | undefined;
  done: boolean | undefined;
  loading: boolean;
}

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
export type UseAsyncIteratorLoadingResponse<T, TReturn, TNext> = UseIteratorResponse<T, TReturn, TNext> & {
  value: T | TReturn | undefined;
  loading: true;
}

export type UseAsyncIteratorLoadedResponse<T, TReturn, TNext> = UseIteratorResponse<T, TReturn, TNext> & {
  value: T | TReturn;
  loading: false;
}

export type UseAsyncIteratorResponse<T, TReturn, TNext> =
  | UseAsyncIteratorLoadingResponse<T, TReturn, TNext>
  | UseAsyncIteratorLoadedResponse<T, TReturn, TNext>;

export const useAsyncIterator = <T, TReturn, TNext>(
  asyncIterator: AsyncIterator<T, TReturn, TNext>,
): UseAsyncIteratorResponse<T, TReturn, TNext> => {
  const [result, update] = useReducer(reducer, initialState);

  const next = useCallback((arg: TNext) => {
    update({ loading: true });

    void asyncIterator
      .next(arg)
      .then(update)
      .catch((error) => update({ error }))
      .finally(() => update({ loading: false }));
  }, [asyncIterator, update]);

  const return_ = useCallback(async (value: TReturn) => {
    update({ loading: true });

    void asyncIterator
      .return?.(value)
      .then(update)
      .catch((error) => update({ error }))
      .finally(() => update({ loading: false }));
  }, [asyncIterator, update]);

  const throw_ = useCallback(async (value: unknown) => {
    update({ loading: true });

    void asyncIterator
      .throw?.(value)
      .then(update)
      .catch((error) => update({ error }))
      .finally(() => update({ loading: false }));
  }, [asyncIterator, update]);

  if (result.done) {
    return {
      done: result.done,
      value: result.value as TReturn,
      loading: result.loading,
      next,
      return: return_,
      throw: throw_,
    };
  }

  return {
    done: result.done,
    value: result.value as T,
    loading: result.loading,
    next,
    return: return_,
    throw: throw_,
  };
}

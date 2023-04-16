import { DependencyList, useEffect } from 'react';
import { useAsyncIterator, UseAsyncIteratorResponse } from './useAsyncIterator';
import { FactoryOrInstance } from './types';

export const useForAwaitOf = <T, TReturn = void>(
  fn: FactoryOrInstance<AsyncIterator<T, TReturn>>,
  deps?: DependencyList,
): UseAsyncIteratorResponse<T, TReturn, void> => {
  const result = useAsyncIterator(fn, deps);

  useEffect(() => {
    if (!result.loading && !result.done) {
      result.next();
    }
  }, [result.loading, result.done]);

  return result;
};

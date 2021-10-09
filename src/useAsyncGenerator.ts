import { DependencyList, useCallback, useMemo } from 'react';
import { useAsyncIterator, UseAsyncIteratorResponse } from './useAsyncIterator';

export const useAsyncGenerator = <T, TReturn = void, TNext = void>(
  fn: () => AsyncGenerator<T, TReturn, TNext>,
  deps: DependencyList,
): UseAsyncIteratorResponse<T, TReturn, TNext> => {
  const asyncGenerator = useCallback(() => fn(), deps);
  const asyncIterator = useMemo(() => asyncGenerator(), [asyncGenerator]);
  return useAsyncIterator(asyncIterator);
};

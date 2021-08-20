import { DependencyList, useCallback, useMemo } from 'react';
import { useAsyncIterator, UseAsyncIteratorResponse } from './useAsyncIterator';

export const useAsyncGenerator = <T, TReturn = void, TNext = undefined>(
  fn: () => AsyncGenerator<T, TReturn, TNext>,
  deps: DependencyList,
): UseAsyncIteratorResponse<T, TReturn, TNext> => {
  const asyncGeneratorFn = useCallback(() => fn(), deps);
  const asyncGenerator = useMemo(() => asyncGeneratorFn(), [asyncGeneratorFn]);
  return useAsyncIterator(asyncGenerator);
}

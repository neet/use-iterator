import { DependencyList, useCallback, useMemo } from 'react';
import { useAsyncIterator } from './useAsyncIterator';

export const useAsyncGenerator = <T, TReturn, TNext>(fn: () => AsyncGenerator<T, TReturn, TNext>, deps: DependencyList) => {
  const asyncGeneratorFn = useCallback(() => fn(), deps);
  const asyncGenerator = useMemo(() => asyncGeneratorFn(), [asyncGeneratorFn]);
  return useAsyncIterator(asyncGenerator);
}

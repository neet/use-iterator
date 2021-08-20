import { DependencyList, useCallback, useMemo } from 'react';
import { useIterator, UseIteratorResponse } from './useIterator';

export const useGenerator = <T, TReturn = void, TNext = undefined>(
  fn: () => Generator<T, TReturn, TNext>,
  deps: DependencyList,
): UseIteratorResponse<T, TReturn, TNext> => {
  const generator = useCallback(() => fn(), deps);
  const iterator = useMemo(() => generator(), [generator]);
  return useIterator(iterator);
};

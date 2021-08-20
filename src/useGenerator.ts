import { DependencyList, useCallback, useMemo } from 'react';
import { useIterator } from './useIterator';

export const useGenerator = <T, TReturn>(fn: () => Generator<T, TReturn, undefined>, deps: DependencyList) => {
  const generator = useCallback(() => fn(), deps);
  const iterator = useMemo(() => generator(), [generator]);
  return useIterator(iterator);
}

import { useMemo } from 'react';
import { useIterator, UseIteratorResponse } from './useIterator';

export const useIterable = <T>(
  iterable: Iterable<T>,
): UseIteratorResponse<T, void, undefined> => {
  const iterator = useMemo(() => {
    return iterable[Symbol.iterator]();
  }, [iterable]);

  return useIterator(iterator);
};

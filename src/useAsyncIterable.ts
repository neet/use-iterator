import { useMemo } from 'react';
import { useAsyncIterator, UseAsyncIteratorResponse } from './useAsyncIterator';

export const useAsyncIterable = <T>(
  iterable: AsyncIterable<T>,
): UseAsyncIteratorResponse<T, void, void> => {
  const iterator = useMemo(() => {
    return iterable[Symbol.asyncIterator]();
  }, [iterable]);

  return useAsyncIterator(iterator);
};

import { useEffect } from 'react';
import { useAsyncIterator, UseAsyncIteratorResponse } from './useAsyncIterator';

export const useForAwaitOf = <T>(
  asyncIterator: AsyncIterator<T>,
): UseAsyncIteratorResponse<T, void, undefined> => {
  const result = useAsyncIterator(asyncIterator);

  useEffect(() => {
    if (!result.loading && !result.done) {
      result.next();
    }
  }, [result.loading, result.done]);

  return result;
};

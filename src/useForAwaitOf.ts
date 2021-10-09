import { useEffect } from 'react';
import { useAsyncIterator, UseAsyncIteratorResponse } from './useAsyncIterator';

export const useForAwaitOf = <T, TReturn = void>(
  asyncIterator: AsyncIterator<T, TReturn, void>,
): UseAsyncIteratorResponse<T, TReturn, void> => {
  const result = useAsyncIterator(asyncIterator);

  useEffect(() => {
    if (!result.loading && !result.done) {
      result.next();
    }
  }, [result.loading, result.done]);

  return result;
};

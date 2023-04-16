import { useAsyncIterator, UseAsyncIteratorResponse } from './useAsyncIterator';
import { FactoryOrInstance } from './types';
import { useOptionalFactory } from './useOptionalFactory';
import { DependencyList } from 'react';

export const useAsyncIterable = <T>(
  fn: FactoryOrInstance<AsyncIterable<T>>,
  deps?: DependencyList,
): UseAsyncIteratorResponse<T, void, void> => {
  const iterable = useOptionalFactory(fn, deps);
  return useAsyncIterator(iterable[Symbol.asyncIterator].bind(iterable), []);
};

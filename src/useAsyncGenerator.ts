import { DependencyList } from 'react';
import { UseAsyncIteratorResponse, useAsyncIterator } from './useAsyncIterator';
import { useOptionalFactory } from './useOptionalFactory';
import { FactoryOrInstance } from './types';

export const useAsyncGenerator = <T, TReturn = void, TNext = void>(
  fn: FactoryOrInstance<AsyncGenerator<T, TReturn, TNext>>,
  deps?: DependencyList,
): UseAsyncIteratorResponse<T, TReturn, TNext> => {
  const generator = useOptionalFactory(fn, deps);
  return useAsyncIterator(generator, []);
};

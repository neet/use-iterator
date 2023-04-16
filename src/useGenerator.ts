import { DependencyList } from 'react';
import { useIterator, UseIteratorResponse } from './useIterator';
import { FactoryOrInstance } from './types';
import { useOptionalFactory } from './useOptionalFactory';

export const useGenerator = <T, TReturn = void, TNext = void>(
  fn: FactoryOrInstance<Generator<T, TReturn, TNext>>,
  deps?: DependencyList,
): UseIteratorResponse<T, TReturn, TNext> => {
  const generator = useOptionalFactory(fn, deps);
  return useIterator(generator, []);
};

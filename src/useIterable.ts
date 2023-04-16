import { DependencyList } from 'react';
import { useIterator, UseIteratorResponse } from './useIterator';
import { FactoryOrInstance } from './types';
import { useOptionalFactory } from './useOptionalFactory';

export const useIterable = <T>(
  fn: FactoryOrInstance<Iterable<T>>,
  deps?: DependencyList,
): UseIteratorResponse<T, void, void> => {
  const iterator = useOptionalFactory(fn, deps);
  return useIterator(iterator[Symbol.iterator].bind(iterator), []);
};

import { DependencyList, useMemo } from 'react';
import { FactoryOrInstance } from './types';

export function useOptionalFactory<T>(
  arg: FactoryOrInstance<T>,
  deps?: DependencyList,
): T {
  const memoDeps = [...(deps ?? [])];
  if (deps == null && typeof arg !== 'function') {
    memoDeps.push(arg);
  }

  return useMemo<T>(() => {
    return typeof arg === 'function' ? (arg as () => T)() : (arg as T);
  }, memoDeps);
}

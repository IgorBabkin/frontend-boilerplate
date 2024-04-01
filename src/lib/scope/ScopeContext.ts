import { createContext, useContext, useMemo } from 'react';
import { IContainer, InjectionToken } from 'ts-ioc-container';
import { ScopeNotFoundError } from './ScopeNotFoundError.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T>(token: InjectionToken<T>) => {
  const scope = useContext(ScopeContext);
  if (scope === undefined) {
    throw new ScopeNotFoundError('Scope is not defined');
  }
  return useMemo(() => scope.resolve(token), [scope, token]);
};

import { createContext, useMemo } from 'react';
import { IContainer, InjectionToken } from 'ts-ioc-container';
import { useContextOrFail } from '../react/context.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T>(token: InjectionToken<T>) => {
  const scope = useContextOrFail(ScopeContext);
  return useMemo(() => scope.resolve(token), [scope, token]);
};

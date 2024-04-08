import { createContext, useEffect, useMemo } from 'react';
import { IContainer, InjectionToken } from 'ts-ioc-container';
import { useContextOrFail } from '../react/context.ts';
import { initialize, isInitializable, isInitialized } from './OnInit.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T extends object>(token: InjectionToken<T>) => {
  const scope = useContextOrFail(ScopeContext);
  const instance = useMemo(() => scope.resolve(token), [scope, token]);

  useEffect(() => {
    if (isInitializable(instance) && !isInitialized(instance)) {
      initialize(instance, scope);
    }
  }, [instance, scope]);

  return instance;
};

import { createContext, useEffect, useMemo } from 'react';
import { IContainer, InjectionToken } from 'ts-ioc-container';
import { useContextOrFail } from '../react/context.ts';
import { isService } from '../mediator/ICommand.ts';
import { isInitializable } from './container.ts';
import { initialize, proxyService } from './service.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T extends object>(token: InjectionToken<T>) => {
  const scope = useContextOrFail(ScopeContext);
  const instance = useMemo(() => {
    const value = scope.resolve(token);
    return isService(value) ? proxyService(value, scope) : value;
  }, [scope, token]);

  useEffect(() => {
    if (isInitializable(instance) && !instance.isInitialized) {
      initialize(instance, scope);
    }
  }, [instance, scope]);

  return instance;
};

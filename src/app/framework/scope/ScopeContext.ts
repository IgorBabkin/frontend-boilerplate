import { createContext, useMemo } from 'react';
import { IContainer } from 'ts-ioc-container';
import { InjectFn } from '@ibabkin/utils';
import { useContextOrFail } from '@core/react/context';
import { dispose, unsubscribeInit } from '@framework/initialize/OnInit';

export const ScopeContext = createContext<IContainer | undefined>(undefined);
export const useDependency = <T extends object>(fn: InjectFn<IContainer, T>) => {
  const scope = useContextOrFail(ScopeContext);
  return useMemo(() => fn(scope), [scope]);
};

export const disposeScope = (scope: IContainer) => {
  for (const instance of scope.getInstances() as object[]) {
    unsubscribeInit(instance);
    dispose(instance, scope);
  }
  if (scope.isDisposed) return;
  scope.dispose();
};

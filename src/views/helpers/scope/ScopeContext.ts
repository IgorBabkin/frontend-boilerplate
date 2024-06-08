import { createContext, useMemo } from 'react';
import { IContainer, InjectFn } from 'ts-ioc-container';
import { useContextOrFail } from '@lib/react/context';
import { dispose, unsubscribeInit } from '@framework/hooks/OnInit';

export const ScopeContext = createContext<IContainer | undefined>(undefined);
export const useDependency = <T extends object>(fn: InjectFn<T>) => {
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

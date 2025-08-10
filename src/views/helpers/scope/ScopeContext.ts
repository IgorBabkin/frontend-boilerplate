import { createContext, useMemo } from 'react';
import { by, DepKey, IContainer } from 'ts-ioc-container';
import { useContextOrFail } from '@lib/react/context';
import { SUBSCRIPTIONS } from '@framework/hooks/Metadata.ts';
import { constructor } from 'ts-ioc-container/typings/utils';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useScope = () => useContextOrFail(ScopeContext);

export const useDep = <T>(fn: DepKey<T> | constructor<T>) => {
  const scope = useContextOrFail(ScopeContext);
  return useMemo(() => by.one(fn).resolve(scope), [fn, scope]);
};

export const disposeScope = (scope: IContainer) => {
  for (const instance of scope.getInstances() as object[]) {
    SUBSCRIPTIONS.destroy(instance);
  }
  scope.dispose();
};

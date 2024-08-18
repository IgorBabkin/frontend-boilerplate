import { createContext, useEffect, useMemo } from 'react';
import { IContainer, InjectFn } from 'ts-ioc-container';
import { useContextOrFail } from '@lib/react/context';
import { dispose, initialize, unsubscribeInit } from '@framework/hooks/OnInit';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useScope = () => useContextOrFail(ScopeContext);

export const useDependency = <T extends object>(fn: InjectFn<T>) => {
  const scope = useContextOrFail(ScopeContext);
  const errorService = IErrorServiceKey.resolve(scope);
  const output = useMemo(() => fn(scope), [fn, scope]);
  useEffect(() => {
    initialize(output, scope).catch((e) => errorService.throwError(e as Error));
  }, [errorService, output, scope]);
  return output;
};

export const disposeScope = (scope: IContainer) => {
  try {
    for (const instance of scope.getInstances() as object[]) {
      unsubscribeInit(instance);
      dispose(instance, scope);
    }
    if (scope.isDisposed) return;
  } catch (e) {
    IErrorServiceKey.resolve(scope).throwError(e as Error);
  } finally {
    scope.dispose();
  }
};

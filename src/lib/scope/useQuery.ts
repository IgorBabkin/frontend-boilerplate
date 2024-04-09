import { useCallback, useEffect } from 'react';
import { useDependency } from './ScopeContext.ts';
import { IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

export const useAsyncEffect = (fn: () => Promise<void>, deps: unknown[]) => {
  const errorBus$ = useDependency(IErrorBusKey.get);
  useEffect(() => {
    fn().catch((e) => errorBus$.next(e));
  }, deps);
};

export const useAsyncEventHandler = <T>(fn: (e: T) => Promise<void>, deps: unknown[]) => {
  const errorBus$ = useDependency(IErrorBusKey.get);
  return useCallback(
    (e: T) => {
      fn(e).catch((error) => errorBus$.next(error));
    },
    [errorBus$, ...deps],
  );
};

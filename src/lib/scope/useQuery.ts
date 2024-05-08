import { useCallback, useEffect } from 'react';
import { IErrorBusKey } from '@domain/errors/ErrorBus.ts';
import { useDependency } from '@lib/scope/Scope.tsx';

export const useAsyncEffect = (fn: () => Promise<void>, deps: unknown[]) => {
  const errorBus$ = useDependency(IErrorBusKey.resolve);
  useEffect(() => {
    fn().catch((e) => errorBus$.next(e));
  }, deps);
};

export const useAsyncEventHandler = <T>(fn: (e: T) => Promise<void>, deps: unknown[]) => {
  const errorBus$ = useDependency(IErrorBusKey.resolve);
  return useCallback(
    (e: T) => {
      fn(e).catch((error) => errorBus$.next(error));
    },
    [errorBus$, ...deps],
  );
};

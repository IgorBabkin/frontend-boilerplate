import { Observable, Subscribable } from 'rxjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDependency } from '@helpers/scope/ScopeContext';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public';

export const useObservable = <T>(fn: () => Observable<T>, initial: T, deps: unknown[]): T => {
  const [value, next] = useState(initial);
  const errorService = useDependency(IErrorServiceKey.resolve);
  const error = useCallback((err: Error) => errorService.throwError(err), [errorService]);
  const obs$ = useMemo(fn, deps);
  useEffect(() => {
    const sub = obs$.subscribe({ next, error });
    return () => sub.unsubscribe();
  }, [obs$, error]);
  return value;
};

export const useObs$ = <T>(obs$: Subscribable<T>, initial: T): T => {
  const [value, next] = useState(initial);
  const errorService = useDependency(IErrorServiceKey.resolve);
  const error = useCallback((err: Error) => errorService.throwError(err), [errorService]);
  useEffect(() => {
    const sub = obs$.subscribe({ next, error });
    return () => sub.unsubscribe();
  }, [obs$, error]);
  return value;
};

export const useAsyncEffect = (fn: () => Promise<void>, deps: unknown[]) => {
  const errorService = useDependency(IErrorServiceKey.resolve);
  useEffect(() => {
    fn().catch((e) => errorService.throwError(e));
  }, deps);
};

export const useAsyncEventHandler = <T>(fn: (e: T) => Promise<void>, deps: unknown[]) => {
  const errorService = useDependency(IErrorServiceKey.resolve);
  return useCallback(
    (e: T) => {
      fn(e).catch((error) => errorService.throwError(error));
    },
    [errorService, ...deps],
  );
};

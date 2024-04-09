import { Observable } from 'rxjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDependency } from '../scope/ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

export const useObservable = <T>(fn: () => Observable<T>, initial: T, deps: unknown[]): T => {
  const [value, next] = useState(initial);
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  const error = useCallback((err: Error) => errorBus$.next(err), [errorBus$]);
  const obs$ = useMemo(fn, deps);
  useEffect(() => {
    const sub = obs$.subscribe({ next, error });
    return () => sub.unsubscribe();
  }, [obs$, error]);
  return value;
};

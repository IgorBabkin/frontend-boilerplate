import { Observable } from 'rxjs';
import { useCallback, useEffect, useState } from 'react';
import { useDependency } from '../scope/ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

export const useObservable = <T>(obs$: Observable<T>, initial: T): T => {
  const [value, next] = useState(initial);
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  const error = useCallback((err: Error) => errorBus$.next(err), [errorBus$]);
  useEffect(() => {
    const sub = obs$.subscribe({ next, error });
    return () => sub.unsubscribe();
  }, [obs$, error]);
  return value;
};

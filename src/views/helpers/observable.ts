import { Observable } from 'rxjs';
import { useCallback, useEffect, useState } from 'react';
import { useDep } from '@helpers/scope/ScopeContext';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public';

const useErrorHandler = () => {
  const errorService = useDep(IErrorServiceKey);
  return useCallback((e: any) => errorService.handleError(e), [errorService]);
};

export const useObservable = <T>(obs$: Observable<T>, initial: T): T => {
  const [value, next] = useState(initial);
  const error = useErrorHandler();
  useEffect(() => {
    const sub = obs$.subscribe({ next, error });
    return () => sub.unsubscribe();
  }, [obs$, error]);
  return value;
};

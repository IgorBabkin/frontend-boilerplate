import { IQuery } from './IQuery.ts';
import { InjectionToken } from 'ts-ioc-container';
import { useCallback, useMemo } from 'react';
import { useObservable } from '../observable/observable.tsx';
import { useDependency } from './ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/ErrorBus.ts';

export const useQuery = <Response>(token: InjectionToken<IQuery<Response>>, initial: Response): Response => {
  const query = useDependency(token);
  const errorBus = useDependency<IErrorBus>(IErrorBusKey);
  const obs$ = useMemo(() => query.execute(), [query]);
  const onError = useCallback((err: Error) => errorBus.next(err), [errorBus]);
  return useObservable(obs$, initial, onError);
};

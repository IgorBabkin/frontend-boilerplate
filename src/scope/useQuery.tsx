import { IQuery } from './IQuery.ts';
import { InjectionToken } from 'ts-ioc-container';
import { useDependency } from './Scope.tsx';
import { useMemo } from 'react';
import { useObservable } from './observable.tsx';

export const useQuery = <Response,>(token: InjectionToken<IQuery<Response>>, initial: Response): Response => {
  const query = useDependency(token);
  const obs$ = useMemo(() => query.execute(), [query]);
  return useObservable(obs$, initial);
};

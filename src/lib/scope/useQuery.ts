import { constructor } from 'ts-ioc-container';
import { useCallback, useMemo } from 'react';
import { useObservable } from '../observable/observable.tsx';
import { useDependency } from './ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/ErrorBus.ts';
import { IMediator } from '../mediator/IMediator.ts';
import { IObservableQueryHandler } from '../mediator/IQueryHandler.ts';

export const useQuery = <TQuery, Response>(
  token: constructor<IObservableQueryHandler<TQuery, Response>>,
  payload: TQuery,
  initial: Response,
): Response => {
  const mediator = useDependency<IMediator>('ICommandMediator');
  const errorBus = useDependency<IErrorBus>(IErrorBusKey);
  const obs$ = useMemo(() => mediator.send$(token, payload), [mediator, token, payload]);
  const onError = useCallback((err: Error) => errorBus.next(err), [errorBus]);
  return useObservable(obs$, initial, onError);
};

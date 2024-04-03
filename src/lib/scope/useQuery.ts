import { constructor } from 'ts-ioc-container';
import { useCallback, useMemo } from 'react';
import { useObservable } from '../observable/observable.tsx';
import { useDependency } from './ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/ErrorBus.ts';
import { IMediator } from '../mediator/IMediator.ts';
import { IObservableQuery, ICommand, IAsyncCommand } from '../mediator/ICommand.ts';

export const useQuery = <TQuery, Response>(
  token: constructor<IObservableQuery<TQuery, Response>>,
  payload: TQuery,
  initial: Response,
): Response => {
  const mediator = useDependency<IMediator>('ICommandMediator');
  const errorBus = useDependency<IErrorBus>(IErrorBusKey);
  const handler = useDependency<IObservableQuery<TQuery, Response>>(token);
  const obs$ = useMemo(() => mediator.send$(handler, payload), [mediator, handler, payload]);
  const onError = useCallback((err: Error) => errorBus.next(err), [errorBus]);
  return useObservable(obs$, initial, onError);
};

export const useCommand = <TPayload>(token: constructor<ICommand<TPayload>>) => {
  const mediator = useDependency<IMediator>('ICommandMediator');
  const handler = useDependency(token);
  return useCallback((payload: TPayload) => mediator.send(handler, payload), [handler, mediator]);
};

export const useAsyncCommand = <TPayload>(token: constructor<IAsyncCommand<TPayload>>) => {
  const mediator = useDependency<IMediator>('ICommandMediator');
  const command = useDependency(token);
  return useCallback((payload: TPayload) => mediator.sendAsync(command, payload), [command, mediator]);
};

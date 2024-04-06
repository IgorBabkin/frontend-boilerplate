import { constructor } from 'ts-ioc-container';
import { useCallback, useEffect, useMemo } from 'react';
import { useObservable } from '../observable/observable.tsx';
import { useDependency } from './ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';
import { IMediator } from '../mediator/IMediator.ts';
import { ICommand, IObservableQuery } from '../mediator/ICommand.ts';
import { ICommandMediatorKey } from '../mediator/CommandMediator.ts';

export const useQuery = <TQuery, Response>(
  token: constructor<IObservableQuery<TQuery, Response>>,
  payload: TQuery,
  initial: Response,
): Response => {
  const mediator = useDependency<IMediator>(ICommandMediatorKey);
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  const handler = useDependency<IObservableQuery<TQuery, Response>>(token);
  const obs$ = useMemo(() => mediator.send$(handler, payload), [mediator, handler, payload]);
  const onError = useCallback((err: Error) => errorBus$.next(err), [errorBus$]);
  return useObservable(obs$, initial, onError);
};

export const useCommand = <TPayload>(token: constructor<ICommand<TPayload>>) => {
  const mediator = useDependency<IMediator>(ICommandMediatorKey);
  const handler = useDependency(token);
  return useCallback((payload: TPayload) => mediator.send(handler, payload), [handler, mediator]);
};

export const useExecCommand = (token: constructor<ICommand<void>>) => {
  const mediator = useDependency<IMediator>(ICommandMediatorKey);
  const handler = useDependency(token);
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  useEffect(() => {
    mediator.send(handler, undefined).catch((e) => errorBus$.next(e));
  }, [mediator, handler, errorBus$]);
};

export const useAsyncEffect = (fn: () => Promise<void>, deps: unknown[]) => {
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  useEffect(() => {
    fn().catch((e) => errorBus$.next(e));
  }, deps);
};

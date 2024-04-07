import { InjectionToken } from 'ts-ioc-container';
import { useEffect, useMemo } from 'react';
import { useDependency } from './ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';
import { IMediator } from '../mediator/IMediator.ts';
import { getCommands, getQuery } from '../mediator/ICommand.ts';
import { ICommandMediatorKey } from '../mediator/CommandMediator.ts';
import { getOnInitHooks, isInitializable } from './container.ts';

export const useService = <TService extends object>(token: InjectionToken<TService>) => {
  const service = useDependency<TService>(token);
  const mediator = useDependency<IMediator>(ICommandMediatorKey);
  const commands = useMemo(() => getCommands(service), [service]);
  const query = useMemo(() => getQuery(service), [service]);
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  const pService = useMemo(
    () =>
      new Proxy(service, {
        get(target, prop) {
          if (typeof prop === 'string' && prop in target) {
            if (commands.includes(prop)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return (payload: any) => mediator.send(target, prop as any, payload);
            }

            if (query.includes(prop)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return (payload: any) => mediator.send$(target, prop as any, payload);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return target[prop];
          }
          throw new Error(`Method ${prop as string} not found on service`);
        },
      }) as TService,
    [commands, service, mediator, query],
  );
  useEffect(() => {
    if (isInitializable(service) && !service.isInitialized) {
      service.isInitialized = true;
      for (const h of getOnInitHooks(service)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const fn = pService[h];
        fn.call(pService).catch((e: Error) => errorBus$.next(e));
      }
    }
  }, [service, errorBus$, pService]);
  return pService;
};

export const useAsyncEffect = (fn: () => Promise<void>, deps: unknown[]) => {
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  useEffect(() => {
    fn().catch((e) => errorBus$.next(e));
  }, deps);
};

import { InjectionToken } from 'ts-ioc-container';
import { useEffect, useMemo } from 'react';
import { useDependency } from './ScopeContext.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';
import { IMediator } from '../mediator/IMediator.ts';
import { getCommands, getQuery } from '../mediator/ICommand.ts';
import { ICommandMediatorKey } from '../mediator/CommandMediator.ts';
import { getOnInitHooks, isInitializable } from './container.ts';

// export const useQuery = <TQuery, Response>(
//   token: constructor<IObservableQuery<TQuery, Response>>,
//   payload: TQuery,
//   initial: Response,
// ): Response => {
//   const handler = useDependency<IObservableQuery<TQuery, Response>>(token);
//   return useObservable(obs$, initial);
// };

export const useController = <TController extends object>(token: InjectionToken<TController>) => {
  const controller = useDependency<TController>(token);
  const mediator = useDependency<IMediator>(ICommandMediatorKey);
  const commands = useMemo(() => getCommands(controller), [controller]);
  const query = useMemo(() => getQuery(controller), [controller]);
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  const pController = useMemo(
    () =>
      new Proxy(controller, {
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
          throw new Error(`Method ${prop as string} not found on controller`);
        },
      }) as TController,
    [commands, controller, mediator, query],
  );
  useEffect(() => {
    if (isInitializable(controller) && !controller.isInitialized) {
      controller.isInitialized = true;
      for (const h of getOnInitHooks(controller)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const fn = pController[h];
        fn.call(pController).catch((e: Error) => errorBus$.next(e));
      }
    }
  }, [controller, errorBus$, pController]);
  return pController;
};

export const useAsyncEffect = (fn: () => Promise<void>, deps: unknown[]) => {
  const errorBus$ = useDependency<IErrorBus>(IErrorBusKey);
  useEffect(() => {
    fn().catch((e) => errorBus$.next(e));
  }, deps);
};

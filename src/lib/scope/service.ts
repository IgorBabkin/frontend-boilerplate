import { getCommands, getQuery } from '../mediator/ICommand.ts';
import { IMediator } from '../mediator/IMediator.ts';
import { getOnInitHooks, OnInit } from './container.ts';
import { IContainer } from 'ts-ioc-container';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';
import { IServiceMediatorKey } from '../mediator/ServiceMediator.ts';

export function proxyService<T extends object>(service: T, scope: IContainer): T {
  const commands = getCommands(service);
  const query = getQuery(service);
  const mediator = scope.resolve<IMediator>(IServiceMediatorKey);

  return new Proxy(service, {
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
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return target[prop];
    },
  });
}

export function initialize(instance: OnInit, scope: IContainer) {
  instance.isInitialized = true;
  const errorBus$ = scope.resolve<IErrorBus>(IErrorBusKey);
  for (const h of getOnInitHooks(instance)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = instance[h];
    fn.call(instance).catch((e: Error) => errorBus$.next(e));
  }
}

import { createContext, useEffect, useMemo } from 'react';
import { IContainer, InjectionToken } from 'ts-ioc-container';
import { useContextOrFail } from '../react/context.ts';
import { getCommands, getQuery, isService } from '../mediator/ICommand.ts';
import { getOnInitHooks, isInitializable, OnInit } from './OnInit.ts';
import { IMediator } from '../mediator/IMediator.ts';
import { IServiceMediatorKey } from '../mediator/ServiceMediator.ts';
import { IErrorBus, IErrorBusKey } from '../../app/domain/errors/ErrorBus.ts';

export const ScopeContext = createContext<IContainer | undefined>(undefined);

export const useDependency = <T extends object>(token: InjectionToken<T>) => {
  const scope = useContextOrFail(ScopeContext);
  const instance = useMemo(() => {
    const value = scope.resolve(token);
    return isService(value) ? proxyService(value, scope) : value;
  }, [scope, token]);

  useEffect(() => {
    if (isInitializable(instance) && !instance.isInitialized) {
      initialize(instance, scope);
    }
  }, [instance, scope]);

  return instance;
};

function proxyService<T extends object>(service: T, scope: IContainer): T {
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

function initialize(instance: OnInit, scope: IContainer) {
  instance.isInitialized = true;
  const errorBus$ = scope.resolve<IErrorBus>(IErrorBusKey);
  for (const h of getOnInitHooks(instance)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fn = instance[h];
    fn.call(instance).catch((e: Error) => errorBus$.next(e));
  }
}

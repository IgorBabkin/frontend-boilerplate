import { IMediator } from './IMediator.ts';
import {
  IContainer,
  inject,
  InstantDependencyOptions,
  IProvider,
  provider,
  ProviderDecorator,
  register,
  singleton,
} from 'ts-ioc-container';

import { SimpleMediator } from './SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './types.ts';
import { Observable, Subscription } from 'rxjs';
import { byCommandAliases } from '../scope/container.ts';
import { getActions, getQuery, IGuard, isClassInstance, matchPayload } from './ICommand.ts';
import { accessor } from '../container/utils.ts';
import { initialize } from '@lib/initialize/OnInit.ts';

export const IServiceMediatorKey = accessor<IMediator>(Symbol('IServiceMediator'));

@register(IServiceMediatorKey.register)
@provider(singleton())
export class ServiceMediator implements IMediator {
  private mediator: SimpleMediator;

  constructor(@inject(byCommandAliases.onBeforeExecution) private beforeCommands: IGuard[]) {
    this.mediator = new SimpleMediator();
  }

  send$<TService extends object, Key extends CommandMethodKeys<TService, QueryMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Observable<Response<TService, Key>> {
    this.runBeforeCommands({ service: service, method }, this.beforeCommands);
    return this.mediator.send$(service, method, payload);
  }

  async send<TService extends object, Key extends CommandMethodKeys<TService, CommandMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void | Subscription> {
    this.runBeforeCommands({ service: service, method }, this.beforeCommands);
    return await this.mediator.send(service, method, payload);
  }

  private runBeforeCommands(target: { service: object; method: string | number | symbol }, beforeCommands: IGuard[]) {
    const commands = beforeCommands.filter((c) => typeof target.method === 'string' && matchPayload(c, target.service));
    for (const c of commands) {
      c.execute(target.service, target.method as string);
    }
  }
}

export const service = <T>(provider: IProvider<T>) => new ServiceProvider(provider);

export class ServiceProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolveInstantly(container: IContainer, options: InstantDependencyOptions): T {
    const instance: T = this.provider.resolve(container, options);
    if (isClassInstance(instance)) {
      const result = this.proxyService(instance, container);

      initialize(result, container);

      return result;
    }

    throw new Error('Service must be a class instance');
  }

  private proxyService<T extends object>(service: T, scope: IContainer): T {
    const actions = getActions(service);
    const query = getQuery(service);
    const mediator = IServiceMediatorKey.resolve(scope);

    return new Proxy(service, {
      get(target, prop) {
        if (typeof prop === 'string' && prop in target) {
          if (actions.has(prop)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (payload: any) => mediator.send(target, prop as any, payload);
          }

          if (query.has(prop)) {
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
}

import { IContainer, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { getActions, getQuery, isClassInstance } from './ICommand.ts';
import { IServiceMediatorKey } from './ServiceMediator.ts';
import { initialize } from '@lib/mediator/OnInit.ts';
import { createSubscriptions } from '@lib/mediator/Subscriber.ts';
import { invokeCondition } from '@lib/mediator/Condition.ts';

export const service = <T>(provider: IProvider<T>) => new ServiceProvider(provider);

export class ServiceProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(container: IContainer, ...args: unknown[]): T {
    const instance: T = this.provider.resolve(container, ...args);
    if (isClassInstance(instance)) {
      const result = this.proxyService(instance, container);

      initialize(result, container);
      createSubscriptions(result, container);
      invokeCondition(result, container);

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

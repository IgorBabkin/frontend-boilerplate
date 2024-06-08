import { IContainer, IProvider, ProviderDecorator, ProviderResolveOptions } from 'ts-ioc-container';
import { initialize } from '@framework/hooks/OnInit.ts';
import { getActions, getQuery } from './metadata.ts';
import { isClassInstance } from '@lib/di/utils.ts';
import { IControllerMediatorKey } from '@framework/controller/ControllerMediator.ts';

export class ControllerProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(container: IContainer, options: ProviderResolveOptions): T {
    const instance: T = this.provider.resolve(container, options);
    if (isClassInstance(instance)) {
      const result = this.proxyService(instance, container);

      initialize(result, container);

      return result;
    }

    throw new Error('Controller must be a class instance');
  }

  private proxyService<T extends object>(service: T, scope: IContainer): T {
    const actions = getActions(service);
    const query = getQuery(service);
    const mediator = IControllerMediatorKey.resolve(scope);

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

export const controller = <T>(provider: IProvider<T>) => new ControllerProvider(provider);

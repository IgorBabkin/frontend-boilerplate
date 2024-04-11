import { IContainer, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { getActions, getQuery, isClassInstance } from './ICommand.ts';
import { IServiceMediatorKey } from './ServiceMediator.ts';

export const service = <T>(provider: IProvider<T>) => new ServiceProvider(provider);

export class ServiceProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  clone(): IProvider<T> {
    return new ServiceProvider(this.provider.clone());
  }

  resolve(container: IContainer, ...args: unknown[]): T {
    const instance = this.provider.resolve(container, ...args);
    return isClassInstance(instance) ? this.proxyService(instance, container) : instance;
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

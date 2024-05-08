import { IContainer, IProvider, InstantDependencyOptions, ProviderDecorator } from 'ts-ioc-container';
import { mapNetworkError } from '../../app/api/mapApiToDomainError.ts';

export class RepositoryProvider extends ProviderDecorator<object> {
  constructor(private provider: IProvider<object>) {
    super(provider);
  }

  resolveInstantly(container: IContainer, options: InstantDependencyOptions): object {
    const instance = this.provider.resolve(container, options);
    return new Proxy(instance, {
      get(target, prop) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value = target[prop];
        if (value instanceof Function) {
          return function (...args: unknown[]) {
            try {
              const result = value.apply(target, args);
              if (result instanceof Promise) {
                return result.catch((e) =>
                  mapNetworkError(e, { method: prop.toString(), target: target.constructor.name }),
                );
              }
              return result;
            } catch (e) {
              throw mapNetworkError(e, { method: prop.toString(), target: target.constructor.name });
            }
          };
        }
        return value;
      },
    });
  }
}

export const repository = (provider: IProvider) => new RepositoryProvider(provider as IProvider<object>);

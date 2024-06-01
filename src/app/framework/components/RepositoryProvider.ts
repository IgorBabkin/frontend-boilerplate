import { IContainer, ProviderResolveOptions, IProvider, ProviderDecorator } from 'ts-ioc-container';

export type MapError = (error: unknown, context: { target: string; method: string }) => Error;

export class RepositoryProvider extends ProviderDecorator<object> {
  constructor(
    private provider: IProvider<object>,
    private mapNetworkError: MapError,
  ) {
    super(provider);
  }

  resolve(container: IContainer, options: ProviderResolveOptions): object {
    const instance = this.provider.resolve(container, options);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
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
                  self.mapNetworkError(e, { method: prop.toString(), target: target.constructor.name }),
                );
              }
              return result;
            } catch (e) {
              throw self.mapNetworkError(e, { method: prop.toString(), target: target.constructor.name });
            }
          };
        }
        return value;
      },
    });
  }
}

export const repository = (mapError: MapError) => (provider: IProvider) =>
  new RepositoryProvider(provider as IProvider<object>, mapError);

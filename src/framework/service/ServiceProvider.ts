import { IContainer, IProvider, ProviderDecorator, ProviderResolveOptions } from 'ts-ioc-container';
import { initialize } from '@framework/hooks/OnInit.ts';
import { isClassInstance } from '@lib/di/utils.ts';

export class ServiceProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(container: IContainer, options: ProviderResolveOptions): T {
    const instance: T = this.provider.resolve(container, options);
    if (isClassInstance(instance)) {
      initialize(instance, container);
      return instance;
    }

    throw new Error('Service must be a class instance');
  }
}

export const service = <T>(provider: IProvider<T>) => new ServiceProvider(provider);

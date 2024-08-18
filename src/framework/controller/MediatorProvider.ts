import { IContainer, IProvider, ProviderDecorator, ProviderResolveOptions } from 'ts-ioc-container';
import { isClassInstance } from '@lib/di/utils.ts';
import { initialize } from '@framework/hooks/OnInit.ts';

export class MediatorProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(container: IContainer, options: ProviderResolveOptions): T {
    const instance: T = this.provider.resolve(container, options);
    if (isClassInstance(instance)) {
      void initialize(instance as object, container);
    }
    return instance;
  }
}

export const mediator = (provider: IProvider): IProvider => new MediatorProvider(provider);

import { constructor, IContainer, IInjector, MetadataInjector } from 'ts-ioc-container';

export class DepInjector implements IInjector {
  private injector = new MetadataInjector();

  resolve<T>(container: IContainer, Target: constructor<T>, ...args: unknown[]): T {
    const instance = this.injector.resolve(container, Target, ...args);

    return instance;
  }
}

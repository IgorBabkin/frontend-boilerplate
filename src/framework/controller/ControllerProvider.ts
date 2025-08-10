import { by, DependencyKey, depKey, type IContainer, inject, IProvider, ProviderDecorator } from 'ts-ioc-container';
import { getActions } from './metadata.ts';
import { isClassInstance } from '@lib/di/utils.ts';
import { type IMediator } from '@lib/mediator/IMediator.ts';
import { CommandLog } from '@lib/timeTravel/CommandLog.ts';
import { IControllerMediatorKey } from '@framework/controller/ControllerMediator.ts';
import { Controller } from '@framework/controller/Controller.ts';
import { ProviderOptions, registerPipe } from 'ts-ioc-container';

interface IOperationLogger {
  log: (operation: CommandLog) => void;
}

export const IOperationLoggerKey = depKey<IOperationLogger>('IOperationLogger');

export class ControllerProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(scope: IContainer, options: ProviderOptions): T {
    const instance: T = this.provider.resolve(scope, options);

    if (!isClassInstance(instance)) {
      throw new Error('Controller must be a class instance');
    }

    const proxyBuilder = ProxyBuilder.resolve(scope);
    return proxyBuilder.build(instance, this.provider.key ?? 'NO KEY') as unknown as T;
  }
}

class ProxyBuilder {
  static resolve(scope: IContainer) {
    return scope.resolve(ProxyBuilder);
  }

  constructor(
    @inject(by.scope.current) private scope: IContainer,
    @inject(IOperationLoggerKey.resolve) private logger: IOperationLogger,
    @inject(IControllerMediatorKey.resolve) private mediator: IMediator<Controller>,
  ) {}

  build(service: object, key: DependencyKey): object {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const actions = getActions(service);
    return new Proxy(service, {
      get(target, prop) {
        if (typeof prop === 'string' && prop in target) {
          if (actions.has(prop)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (payload: any) => {
              self.logger.log({
                key: key.toString(),
                methodName: prop as string,
                tagPath: self.scope.getPath(),
                payload: [payload],
                createdAt: Date.now(),
              });
              // eslint-disable-next-line
              return self.mediator.send(target as Controller, prop as any as never, payload);
            };
          }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return target[prop];
      },
    });
  }
}

export const controller = () => registerPipe(<T>(provider: IProvider<T>) => new ControllerProvider(provider));

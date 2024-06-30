import { IContainer, IProvider, ProviderDecorator, ProviderResolveOptions } from 'ts-ioc-container';
import { initialize } from '@framework/hooks/OnInit.ts';
import { getActions, getQuery } from './metadata.ts';
import { accessor, isClassInstance } from '@lib/di/utils.ts';
import { IControllerMediatorKey } from '@framework/controller/ControllerMediator.ts';
import { IMediator } from '@lib/mediator/IMediator.ts';
import { OperationLog } from '@lib/timeTravel/OperationLog.ts';

interface IOperationLogger {
  log: (operation: OperationLog) => void;
}

const IOperationLoggerKey = accessor<IOperationLogger>(Symbol('IOperationLogger'));

export class ControllerProvider<T> extends ProviderDecorator<T> {
  private isReplayingEnabled: boolean = false;
  qwer = 1;§
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(container: IContainer, options: ProviderResolveOptions): T {
    let instance: T = this.provider.resolve(container, options);
    if (isClassInstance(instance)) {
      const proxyBuilder = container.resolve(ProxyBuilder);
      instance = proxyBuilder.build(instance) as any;

      if (!this.isReplayingEnabled) {
        initialize(instance as object, container);
      }

      return instance;
    }

    throw new Error('Controller must be a class instance');
  }
}

const getKeyByInstance = (scope: IContainer) => (service: object) => {
  return scope.getKey(service);
};

class ProxyBuilder {
  constructor(
    private scope: IContainer,
    private logger: IOperationLogger,
    private mediator: IMediator,
    private getKeyByInstance: (service: object) => string,
  ) {}

  build(service: object): object {
    const self = this;
    const actions = getActions(service);
    const query = getQuery(service);
    return new Proxy(service, {
      get(target, prop) {
        if (typeof prop === 'string' && prop in target) {
          if (actions.has(prop)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (payload: any) => {
              self.logger.log({
                key: self.getKeyByInstance(service),
                methodName: prop as string,
                path: self.scope.getPath(),
                payload: JSON.stringify([payload]),
                createdAt: Date.now(),
              });
              return self.mediator.send(target, prop as any, payload);
            };
          }

          if (query.has(prop)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (payload: any) => self.mediator.send$(target, prop as any, payload);
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

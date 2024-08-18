import {
  by,
  DependencyKey,
  type IContainer,
  inject,
  IProvider,
  ProviderDecorator,
  ProviderResolveOptions,
} from 'ts-ioc-container';
import { getActions } from '../controller/metadata.ts';
import { accessor, isClassInstance } from '@lib/di/utils.ts';
import { type IMediator } from '@lib/mediator/IMediator.ts';
import { CommandLog } from '@lib/timeTravel/CommandLog.ts';
import { IMiddlewareMediatorKey } from '@framework/middleware/MiddlewareMediator.ts';
import { IMiddleware } from '@framework/guard/IMiddleware.ts';

interface IOperationLogger {
  log: (operation: CommandLog) => void;
}

export const IOperationLoggerKey = accessor<IOperationLogger>('IOperationLogger');

export class MiddlewareProvider<T> extends ProviderDecorator<T> {
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(scope: IContainer, options: ProviderResolveOptions): T {
    const instance: T = this.provider.resolve(scope, options);
    if (isClassInstance(instance)) {
      return ProxyBuilder.resolve(scope).build(instance, this.provider.key ?? 'NO KEY') as unknown as T;
    }

    throw new Error('Controller must be a class instance');
  }
}

class ProxyBuilder {
  static resolve(scope: IContainer) {
    return scope.resolve(ProxyBuilder);
  }

  constructor(
    @inject(by.scope.current) private scope: IContainer,
    @inject(IOperationLoggerKey.resolve) private logger: IOperationLogger,
    @inject(IMiddlewareMediatorKey.resolve) private mediator: IMediator<IMiddleware>,
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
              return self.mediator.send(target as IMiddleware, prop as any as never, payload);
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

export const middleware = <T>(provider: IProvider<T>) => new MiddlewareProvider(provider);

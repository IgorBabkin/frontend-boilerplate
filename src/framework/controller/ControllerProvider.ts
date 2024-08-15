import {
  by,
  DependencyKey,
  type IContainer,
  inject,
  IProvider,
  ProviderDecorator,
  ProviderResolveOptions,
  serializeTagsPath,
} from 'ts-ioc-container';
import { initialize } from '@framework/hooks/OnInit.ts';
import { getActions, getQuery } from './metadata.ts';
import { accessor, isClassInstance } from '@lib/di/utils.ts';
import { type IMediator } from '@lib/mediator/IMediator.ts';
import { CommandLog } from '@lib/timeTravel/CommandLog.ts';
import { IControllerMediatorKey } from '@framework/controller/ControllerMediator.ts';

interface IOperationLogger {
  log: (operation: CommandLog) => void;
}

export const IOperationLoggerKey = accessor<IOperationLogger>('IOperationLogger');

export class CommandLogger implements IOperationLogger {
  private commands: CommandLog[] = [];

  startTime: Date = new Date();

  log(operation: CommandLog) {
    this.commands.push({
      ...operation,
      createdAt: operation.createdAt - this.startTime.getTime(),
    });
  }

  stringify() {
    return JSON.stringify(this.commands);
  }
}

export class ControllerProvider<T> extends ProviderDecorator<T> {
  private isReplayingEnabled: boolean = false;
  constructor(private provider: IProvider<T>) {
    super(provider);
  }

  resolve(container: IContainer, options: ProviderResolveOptions): T {
    let instance: T = this.provider.resolve(container, options);
    if (isClassInstance(instance)) {
      const proxyBuilder = container.resolve(ProxyBuilder);
      instance = proxyBuilder.build(instance, this.provider.key ?? 'NO KEY') as any;

      if (!this.isReplayingEnabled) {
        initialize(instance as object, container);
      }

      return instance;
    }

    throw new Error('Controller must be a class instance');
  }
}

class ProxyBuilder {
  constructor(
    @inject(by.scope.current) private scope: IContainer,
    @inject(IOperationLoggerKey.resolve) private logger: IOperationLogger,
    @inject(IControllerMediatorKey.resolve) private mediator: IMediator,
  ) {}

  build(service: object, key: DependencyKey): object {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
                key: key.toString(),
                methodName: prop as string,
                path: serializeTagsPath(self.scope.getPath()),
                payload: [payload],
                createdAt: Date.now(),
              });
              // eslint-disable-next-line
              return self.mediator.send(target, prop as any as never, payload);
            };
          }

          if (query.has(prop)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (payload: any) => self.mediator.send$(target, prop as any as never, payload);
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

import { FailedCommand, IMediator } from '@lib/mediator/IMediator.ts';
import { depKey, inject, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from '@lib/mediator/SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload } from '@lib/mediator/types.ts';
import { onDispose, onViewInit } from '@framework/hooks/OnViewInit.ts';
import { InvalidAccessTokenError } from '@framework/errors/InvalidAccessTokenError.ts';
import { IAuthStoreKey } from '@services/auth/IAuthStore.ts';
import { NoPermissionError } from '@framework/errors/NoPermissionError.ts';
import { type IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { IMiddleware } from '@framework/guard/IMiddleware.ts';
import { Controller } from '@framework/controller/Controller.ts';
import { execute, subscribeOn } from '@framework/hooks/initHooks.ts';

export const IMiddlewareMediatorKey = depKey<IMediator<IMiddleware>>('IMiddlewareMediator');

@register(IMiddlewareMediatorKey, 'required', singleton())
export class MiddlewareMediator implements IMediator<IMiddleware> {
  private mediator: SimpleMediator<IMiddleware>;
  private failedCommands: FailedCommand<IMiddleware>[] = [];

  constructor(@inject(IErrorServiceKey.resolve) private errorService: IErrorService) {
    this.mediator = new SimpleMediator();
  }

  private isAccessTokenCommand(c: FailedCommand<IMiddleware>) {
    return c.error instanceof InvalidAccessTokenError || c.error instanceof NoPermissionError;
  }

  @onViewInit(subscribeOn({ when$: [(s) => IAuthStoreKey.resolve(s).accessToken$] }))
  async retryFailedCommands(): Promise<void> {
    for (const command of this.failedCommands.filter(this.isAccessTokenCommand)) {
      try {
        await command.retry(this);
      } catch (e) {
        this.failedCommands.push(new FailedCommand(command.target, command.method, command.payload, e));
        this.errorService.throwError(e as Error);
      } finally {
        this.failedCommands = this.failedCommands.filter((c) => c !== command);
      }
    }
  }

  @onDispose(execute())
  flushFailedCommands() {
    this.failedCommands = [];
  }

  async send<TService extends IMiddleware, Key extends CommandMethodKeys<TService, CommandMethod>>(
    controller: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void> {
    try {
      await this.mediator.send(controller, method, payload);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.failedCommands.push(new FailedCommand<IMiddleware<Controller>>(controller, method, payload, e));
      throw e;
    }
  }
}

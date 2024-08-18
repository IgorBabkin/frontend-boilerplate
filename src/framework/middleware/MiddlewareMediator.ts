import { FailedCommand, IMediator } from '@lib/mediator/IMediator.ts';
import { alias, inject, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from '@lib/mediator/SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload } from '@lib/mediator/types.ts';
import { accessor } from '@lib/di/utils.ts';
import { execute, onDispose, onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { InvalidAccessTokenError } from '@framework/errors/InvalidAccessTokenError.ts';
import { IAuthServiceKey } from '@services/auth/IAuthService.public.ts';
import { NoPermissionError } from '@framework/errors/NoPermissionError.ts';
import { type IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { IMiddleware } from '@framework/guard/IMiddleware.ts';
import { Controller } from '@framework/controller/Controller.ts';

export const IMiddlewareMediatorKey = accessor<IMediator<IMiddleware>>('IMiddlewareMediator');

@register(IMiddlewareMediatorKey.register)
@provider(singleton(), alias('required'))
export class MiddlewareMediator implements IMediator<IMiddleware> {
  private mediator: SimpleMediator<IMiddleware>;
  private failedCommands: FailedCommand<IMiddleware>[] = [];

  constructor(@inject(IErrorServiceKey.resolve) private errorService: IErrorService) {
    this.mediator = new SimpleMediator();
  }

  private isAccessTokenCommand(c: FailedCommand<IMiddleware>) {
    return c.error instanceof InvalidAccessTokenError || c.error instanceof NoPermissionError;
  }

  @onInit(subscribeOn({ targets$: [(s) => IAuthServiceKey.resolve(s).accessToken$] }))
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

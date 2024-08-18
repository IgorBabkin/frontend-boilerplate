import { FailedCommand, IMediator } from '@lib/mediator/IMediator.ts';
import { alias, inject, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from '@lib/mediator/SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload } from '@lib/mediator/types.ts';
import { Subscription } from 'rxjs';
import { byCommandAliases } from '@framework/scope.ts';
import { IGuard, matchPayload } from '@framework/guard/IGuard.ts';
import { accessor } from '@lib/di/utils.ts';
import { execute, onDispose, onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { InvalidAccessTokenError } from '@framework/errors/InvalidAccessTokenError.ts';
import { IAuthServiceKey } from '@services/auth/IAuthService.public.ts';
import { NoPermissionError } from '@framework/errors/NoPermissionError.ts';
import { type IErrorService, IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { IMiddleware, matchMiddleware } from '@framework/guard/IMiddleware.ts';
import { Controller } from '@framework/controller/Controller.ts';
import { promisify } from 'ts-ioc-container/typings/utils';

export const IControllerMediatorKey = accessor<IMediator<Controller>>('IControllerMediator');

@register(IControllerMediatorKey.register)
@provider(singleton(), alias('required'))
export class ControllerMediator implements IMediator<Controller> {
  private mediator: SimpleMediator<Controller>;
  private failedCommands: FailedCommand<Controller>[] = [];

  constructor(
    @inject(byCommandAliases.onBeforeExecution) private guards: IGuard[],
    @inject(byCommandAliases.onAfterExecution) private middlewareAfter: IMiddleware[],
    @inject(IErrorServiceKey.resolve) private errorService: IErrorService,
  ) {
    this.mediator = new SimpleMediator();
  }

  private isAccessTokenCommand(c: FailedCommand<Controller>) {
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
        this.failedCommands.splice(this.failedCommands.indexOf(command), 1);
      }
    }
  }

  @onDispose(execute())
  flushFailedCommands() {
    this.failedCommands.splice(0, this.failedCommands.length);
  }

  async send<TService extends Controller, Key extends CommandMethodKeys<TService, CommandMethod>>(
    controller: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void | Subscription> {
    try {
      this.executeGuards({ controller, method });
      const result = await this.mediator.send(controller, method, payload);
      this.runMiddleware({ controller, method }).catch((e) => {
        this.errorService.throwError(e);
      });
      return result;
    } catch (e) {
      // eslint-disable-next-line
      this.failedCommands.push(new FailedCommand<Controller>(controller, method as any, payload, e));
      throw e;
    }
  }

  private executeGuards({ controller, method }: { controller: object; method: string | number | symbol }): void {
    for (const c of this.guards.filter((c) => typeof method === 'string' && matchPayload(c, controller))) {
      c.execute(controller, method as string);
    }
  }

  private async runMiddleware({
    controller,
    method,
  }: {
    controller: object;
    method: string | number | symbol;
  }): Promise<void> {
    const commands = this.middlewareAfter.filter(
      // eslint-disable-next-line
      (c) => typeof method === 'string' && matchMiddleware(c, method as any, controller),
    );

    await Promise.all(
      commands.map((c) => {
        return promisify(c.execute(controller, method as string)).catch((e) => {
          this.errorService.throwError(e);
        });
      }),
    );
  }
}

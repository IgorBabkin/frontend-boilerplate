import { IMediator } from '@lib/mediator/IMediator.ts';
import { inject, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from '@lib/mediator/SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from '@lib/mediator/types.ts';
import { Observable, Subscription } from 'rxjs';
import { byCommandAliases } from '@framework/scope.ts';
import { IGuard, matchPayload } from '@framework/guard/IGuard.ts';
import { accessor } from '@lib/di/utils.ts';

export const IControllerMediatorKey = accessor<IMediator>('IControllerMediator');

@register(IControllerMediatorKey.register)
@provider(singleton())
export class ControllerMediator implements IMediator {
  private mediator: SimpleMediator;

  constructor(@inject(byCommandAliases.onBeforeExecution) private beforeCommands: IGuard[]) {
    this.mediator = new SimpleMediator();
  }

  send$<TService extends object, Key extends CommandMethodKeys<TService, QueryMethod>>(
    controller: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Observable<Response<TService, Key>> {
    this.runBeforeCommands({ controller: controller, method }, this.beforeCommands);
    return this.mediator.send$(controller, method, payload);
  }

  async send<TService extends object, Key extends CommandMethodKeys<TService, CommandMethod>>(
    controller: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void | Subscription> {
    this.runBeforeCommands({ controller: controller, method }, this.beforeCommands);
    return await this.mediator.send(controller, method, payload);
  }

  private runBeforeCommands(
    { controller, method }: { controller: object; method: string | number | symbol },
    beforeCommands: IGuard[],
  ) {
    for (const c of beforeCommands.filter((c) => typeof method === 'string' && matchPayload(c, controller))) {
      c.execute(controller, method as string);
    }
  }
}

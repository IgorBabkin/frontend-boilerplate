import { IMediator } from '@lib/mediator/IMediator.ts';
import { inject, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from '@lib/mediator/SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from '@lib/mediator/types.ts';
import { Observable, Subscription } from 'rxjs';
import { byCommandAliases } from '@framework/scope.ts';
import { IGuard, matchPayload } from '@framework/guard/IGuard.ts';
import { Accessor } from '@lib/di/utils.ts';

export const IServiceMediatorKey = new Accessor<IMediator>('IServiceMediator');

@register(IServiceMediatorKey.register)
@provider(singleton())
export class ServiceMediator implements IMediator {
  private mediator: SimpleMediator;

  constructor(@inject(byCommandAliases.onBeforeExecution) private beforeCommands: IGuard[]) {
    this.mediator = new SimpleMediator();
  }

  send$<TService extends object, Key extends CommandMethodKeys<TService, QueryMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Observable<Response<TService, Key>> {
    this.runBeforeCommands({ service: service, method }, this.beforeCommands);
    return this.mediator.send$(service, method, payload);
  }

  async send<TService extends object, Key extends CommandMethodKeys<TService, CommandMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void | Subscription> {
    this.runBeforeCommands({ service: service, method }, this.beforeCommands);
    return await this.mediator.send(service, method, payload);
  }

  private runBeforeCommands(
    { service, method }: { service: object; method: string | number | symbol },
    beforeCommands: IGuard[],
  ) {
    for (const c of beforeCommands.filter((c) => typeof method === 'string' && matchPayload(c, service))) {
      c.execute(service, method as string);
    }
  }
}

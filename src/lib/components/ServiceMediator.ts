import { IMediator } from './IMediator.ts';
import { inject, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from './SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './types.ts';
import { Observable, Subscription } from 'rxjs';
import { byCommandAliases } from '../scope/container.ts';
import { IGuard, matchPayload } from './operations.ts';
import { accessor } from '../container/utils.ts';

export const IServiceMediatorKey = accessor<IMediator>(Symbol('IServiceMediator'));

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
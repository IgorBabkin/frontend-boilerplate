import { IMediator } from './IMediator.ts';
import { inject, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from './SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './types.ts';
import { Observable } from 'rxjs';
import { byCommandAliases } from '../scope/container.ts';
import { IGuard, matchPayload, ServiceInfo } from './ICommand.ts';
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
    return this.mediator.send$(service, method, payload);
  }

  async send<TService extends object, Key extends CommandMethodKeys<TService, CommandMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void> {
    await this.runBeforeCommands({ service: service, method }, this.beforeCommands);
    await this.mediator.send(service, method, payload);
  }

  private async runBeforeCommands(target: ServiceInfo, beforeCommands: IGuard[]) {
    const commands = beforeCommands.filter((c) => typeof target.method === 'string' && matchPayload(c, target.service));
    for (const c of commands) {
      await c.execute(target.service, target.method as string);
    }
  }
}

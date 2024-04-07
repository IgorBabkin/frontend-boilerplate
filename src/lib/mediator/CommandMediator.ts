import { IMediator } from './IMediator.ts';
import { inject, key, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from './SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './myTypes.ts';
import { Observable } from 'rxjs';
import { byCommandAliases } from '../scope/container.ts';
import { ControllerInfo, IGuard, matchPayload } from './ICommand.ts';

export const ICommandMediatorKey = Symbol('ICommandMediator');

@register(key(ICommandMediatorKey))
@provider(singleton())
export class CommandMediator implements IMediator {
  private mediator: SimpleMediator;

  constructor(@inject(byCommandAliases.onBeforeExecution) private beforeCommands: IGuard[]) {
    this.mediator = new SimpleMediator();
  }

  send$<TController extends object, Key extends CommandMethodKeys<TController, QueryMethod>>(
    controller: TController,
    method: Key,
    payload: Payload<TController, Key>,
  ): Observable<Response<TController, Key>> {
    return this.mediator.send$(controller, method, payload);
  }

  async send<TController extends object, Key extends CommandMethodKeys<TController, CommandMethod>>(
    controller: TController,
    method: Key,
    payload: Payload<TController, Key>,
  ): Promise<void> {
    await this.runBeforeCommands({ controller, method }, this.beforeCommands);
    await this.mediator.send(controller, method, payload);
  }

  private async runBeforeCommands(target: ControllerInfo, beforeCommands: IGuard[]) {
    const commands = beforeCommands.filter(
      (c) => typeof target.method === 'string' && matchPayload(c, target.controller),
    );
    for (const c of commands) {
      await c.execute(target.controller, target.method as string);
    }
  }
}

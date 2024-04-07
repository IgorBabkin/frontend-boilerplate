import { IMediator } from './IMediator.ts';
import { key, provider, register, singleton } from 'ts-ioc-container';

import { SimpleMediator } from './SimpleMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './myTypes.ts';
import { Observable } from 'rxjs';

export const ICommandMediatorKey = Symbol('ICommandMediator');

@register(key(ICommandMediatorKey))
@provider(singleton())
export class CommandMediator implements IMediator {
  private mediator: SimpleMediator;

  constructor() {
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
    await this.mediator.send(controller, method, payload);
  }
}

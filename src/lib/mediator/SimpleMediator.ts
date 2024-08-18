import { Subscription } from 'rxjs';
import { IMediator } from '@lib/mediator/IMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload } from '@lib/mediator/types.ts';

export class SimpleMediator<Target extends object> implements IMediator<Target> {
  async send<TService extends Target, Key extends CommandMethodKeys<TService, CommandMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void | Subscription> {
    const fn = service[method] as CommandMethod<Payload<TService, Key>>;
    const result = fn.call(service, payload);
    if (result instanceof Promise) {
      return await result;
    }
  }
}

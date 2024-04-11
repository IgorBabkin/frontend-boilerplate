import { Observable, Subscription } from 'rxjs';
import { IMediator } from './IMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './types.ts';

export class SimpleMediator implements IMediator {
  send$<TService extends object, Key extends CommandMethodKeys<TService, QueryMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Observable<Response<TService, Key>> {
    const fn = service[method] as QueryMethod<Payload<TService, Key>, Response<TService, Key>>;
    return fn.call(service, payload);
  }

  async send<TService extends object, Key extends CommandMethodKeys<TService, CommandMethod>>(
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

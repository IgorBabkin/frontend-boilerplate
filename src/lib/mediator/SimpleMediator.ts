import { Observable } from 'rxjs';
import { IMediator } from './IMediator.ts';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './myTypes.ts';

export class SimpleMediator implements IMediator {
  send$<TController extends object, Key extends CommandMethodKeys<TController, QueryMethod>>(
    controller: TController,
    method: Key,
    payload: Payload<TController, Key>,
  ): Observable<Response<TController, Key>> {
    const fn = controller[method] as QueryMethod<Payload<TController, Key>, Response<TController, Key>>;
    return fn.call(controller, payload);
  }

  async send<TController extends object, Key extends CommandMethodKeys<TController, CommandMethod>>(
    controller: TController,
    method: Key,
    payload: Payload<TController, Key>,
  ): Promise<void> {
    const fn = controller[method] as CommandMethod<Payload<TController, Key>>;
    await fn.call(controller, payload);
  }
}

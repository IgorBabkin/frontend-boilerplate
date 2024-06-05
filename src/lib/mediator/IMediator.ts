import { Observable, Subscription } from 'rxjs';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from '@lib/mediator/types.ts';

export interface IMediator {
  send<TService extends object, Key extends CommandMethodKeys<TService, CommandMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void | Subscription>;

  send$<TService extends object, Key extends CommandMethodKeys<TService, QueryMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Observable<Response<TService, Key>>;
}

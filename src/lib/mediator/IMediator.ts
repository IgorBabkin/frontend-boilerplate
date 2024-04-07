import { Observable } from 'rxjs';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './utilTypes.ts';

export interface IMediator {
  send<TService extends object, Key extends CommandMethodKeys<TService, CommandMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Promise<void>;

  send$<TService extends object, Key extends CommandMethodKeys<TService, QueryMethod>>(
    service: TService,
    method: Key,
    payload: Payload<TService, Key>,
  ): Observable<Response<TService, Key>>;
}

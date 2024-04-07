import { Observable } from 'rxjs';
import { CommandMethod, CommandMethodKeys, Payload, QueryMethod, Response } from './myTypes.ts';

export interface IMediator {
  send<TController extends object, Key extends CommandMethodKeys<TController, CommandMethod>>(
    controller: TController,
    method: Key,
    payload: Payload<TController, Key>,
  ): Promise<void>;

  send$<TController extends object, Key extends CommandMethodKeys<TController, QueryMethod>>(
    controller: TController,
    method: Key,
    payload: Payload<TController, Key>,
  ): Observable<Response<TController, Key>>;
}

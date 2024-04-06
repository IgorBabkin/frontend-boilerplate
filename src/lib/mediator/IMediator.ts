import { ICommand, IObservableQuery } from './ICommand.ts';
import { Observable } from 'rxjs';

export interface IMediator {
  send<TPayload = never>(command: ICommand<TPayload>, payload: TPayload): Promise<void>;

  send$<TPayload, TResponse>(query: IObservableQuery<TPayload, TResponse>, payload: TPayload): Observable<TResponse>;
}

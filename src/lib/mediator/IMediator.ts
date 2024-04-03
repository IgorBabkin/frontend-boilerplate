import { IObservableQuery, ICommand, IAsyncCommand } from './ICommand.ts';
import { Observable } from 'rxjs';

export interface IMediator {
  send<TPayload>(command: ICommand<TPayload>, payload: TPayload): void;

  sendAsync<TPayload>(command: IAsyncCommand<TPayload>, payload: TPayload): void;

  send$<TPayload, TResponse>(query: IObservableQuery<TPayload, TResponse>, payload: TPayload): Observable<TResponse>;
}

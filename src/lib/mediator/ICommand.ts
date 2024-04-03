import { Observable } from 'rxjs';

export interface ICommand<TPayload = void> {
  execute(payload: TPayload): void;
}

export interface IAsyncCommand<TQuery = void> {
  executeAsync(payload: TQuery): Promise<void>;
}

export function isAsyncCommand<TQuery>(
  command: ICommand<TQuery> | IAsyncCommand<TQuery>,
): command is IAsyncCommand<TQuery> {
  return (command as IAsyncCommand<TQuery>).executeAsync !== undefined;
}

export interface IObservableQuery<TPayload, TResponse> {
  create(payload: TPayload): Observable<TResponse>;
}

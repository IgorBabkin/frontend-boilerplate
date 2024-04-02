import { Observable } from 'rxjs';

export interface IQueryHandler<TQuery = void> {
  handle(query: TQuery): Promise<void>;
}

export interface IObservableQueryHandler<TQuery, TResponse> {
  handle(query: TQuery): Observable<TResponse>;
}

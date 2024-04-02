import { IObservableQueryHandler, IQueryHandler } from './IQueryHandler.ts';
import { constructor } from 'ts-ioc-container';
import { Observable } from 'rxjs';

export interface IMediator {
  send<TQuery>(QueryHandler: constructor<IQueryHandler<TQuery>>, query: TQuery): Promise<void>;

  send$<TQuery, TResponse>(
    QueryHandler: constructor<IObservableQueryHandler<TQuery, TResponse>>,
    query: TQuery,
  ): Observable<TResponse>;
}

import { Observable } from 'rxjs';
import { IMediator } from './IMediator';
import { IObservableQueryHandler, IQueryHandler } from './IQueryHandler';
import { constructor, IContainer } from 'ts-ioc-container';

export class SimpleMediator implements IMediator {
  constructor(private scope: IContainer) {}

  send$<TQuery, TResponse>(
    QueryHandler: constructor<IObservableQueryHandler<TQuery, TResponse>>,
    query: TQuery,
  ): Observable<TResponse> {
    const useCase = this.scope.resolve(QueryHandler);

    const result = useCase.handle(query);

    return result;
  }

  async send<TQuery = void>(QueryHandler: constructor<IQueryHandler<TQuery>>, query: TQuery): Promise<void> {
    const useCase = this.scope.resolve(QueryHandler);

    const result = await useCase.handle(query);

    return result;
  }
}

import { IObservableQueryHandler, IQueryHandler } from './IQueryHandler';
import { IMediator } from './IMediator';
import { IContainer, constructor } from 'ts-ioc-container';
import { Observable } from 'rxjs';

export abstract class ScopedMediator implements IMediator {
  protected abstract scopes: string[];

  constructor(private scope: IContainer) {}

  send$<TQuery, TResponse>(
    QueryHandler: constructor<IObservableQueryHandler<TQuery, TResponse>>,
    query: TQuery,
  ): Observable<TResponse> {
    const scope = this.scope.createScope(...this.scopes);
    try {
      const mediator = this.createMediator(scope);
      return mediator.send$(QueryHandler, query);
    } finally {
      scope.dispose();
    }
  }

  async send<TQuery>(QueryHandler: constructor<IQueryHandler<TQuery>>, query: TQuery): Promise<void> {
    const scope = this.scope.createScope(...this.scopes);
    try {
      const mediator = this.createMediator(scope);
      return await mediator.send(QueryHandler, query);
    } finally {
      scope.dispose();
    }
  }

  protected abstract createMediator(scope: IContainer): IMediator;
}

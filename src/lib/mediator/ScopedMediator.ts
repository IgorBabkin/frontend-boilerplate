import { IQueryHandler } from './IQueryHandler';
import { IMediator } from './IMediator';
import { IContainer, constructor } from 'ts-ioc-container';

export abstract class ScopedMediator implements IMediator {
  protected abstract scopes: string[];

  constructor(private scope: IContainer) {}

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

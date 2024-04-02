import { IMediator } from './IMediator';
import { IQueryHandler } from './IQueryHandler';
import { IContainer, constructor } from 'ts-ioc-container';

export class SimpleMediator implements IMediator {
  constructor(private scope: IContainer) {}

  async send<TQuery = void>(QueryHandler: constructor<IQueryHandler<TQuery>>, query: TQuery): Promise<void> {
    const useCase = this.scope.resolve(QueryHandler);

    const result = await useCase.handle(query);

    return result;
  }
}

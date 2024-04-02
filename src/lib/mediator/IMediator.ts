import { IQueryHandler } from './IQueryHandler.ts';
import { constructor } from 'ts-ioc-container';

export interface IMediator {
  send<TQuery>(QueryHandler: constructor<IQueryHandler<TQuery>>, query: TQuery): Promise<void>;
}

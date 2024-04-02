export interface IQueryHandler<TQuery = void> {
  handle(query: TQuery): Promise<void>;
}

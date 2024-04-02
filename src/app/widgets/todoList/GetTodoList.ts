import { by, inject } from 'ts-ioc-container';
import { TodoStore } from '../../domain/TodoStore.ts';
import { Observable } from 'rxjs';
import { IObservableQueryHandler } from '../../../lib/mediator/IQueryHandler.ts';

export class GetTodoList implements IObservableQueryHandler<void, string[]> {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  handle(): Observable<string[]> {
    return this.todoStore.getList$();
  }
}

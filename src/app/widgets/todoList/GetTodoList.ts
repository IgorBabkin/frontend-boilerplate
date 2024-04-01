import { by, inject } from 'ts-ioc-container';
import { TodoStore } from '../../domain/TodoStore.ts';
import { Observable } from 'rxjs';
import { IQuery } from '../../../lib/scope/IQuery.ts';

export class GetTodoList implements IQuery<string[]> {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  execute(): Observable<string[]> {
    return this.todoStore.getList$();
  }
}

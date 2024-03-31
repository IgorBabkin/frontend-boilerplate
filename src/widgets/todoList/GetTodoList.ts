import { by, inject } from 'ts-ioc-container';
import { TodoStore } from './TodoStore.ts';
import { Observable } from 'rxjs';
import { IQuery } from '../../scope/IQuery.ts';

export class GetTodoList implements IQuery<string[]> {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  execute(): Observable<string[]> {
    return this.todoStore.getList$();
  }
}

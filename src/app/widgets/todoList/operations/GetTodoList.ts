import { by, inject } from 'ts-ioc-container';
import { TodoStore } from '../../../domain/TodoStore.ts';
import { Observable } from 'rxjs';
import { IObservableQuery } from '../../../../lib/mediator/ICommand.ts';

export class GetTodoList implements IObservableQuery<void, string[]> {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  create(): Observable<string[]> {
    return this.todoStore.getList$();
  }
}

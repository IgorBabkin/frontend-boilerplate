import { by, inject } from 'ts-ioc-container';
import { TodoStore } from '../../../domain/TodoStore.ts';
import { Observable } from 'rxjs';
import { IObservableQuery } from '../../../../lib/mediator/ICommand.ts';
import { ITodo } from '../../../domain/ITodo.ts';

export class GetTodoList implements IObservableQuery<void, ITodo[]> {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  create(): Observable<ITodo[]> {
    return this.todoStore.getList$();
  }
}

import { by, inject } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../../domain/todo/TodoStore.ts';
import { Observable } from 'rxjs';
import { IObservableQuery } from '../../../../lib/mediator/ICommand.ts';
import { ITodo } from '../../../domain/todo/ITodo.ts';
import { IResource } from '../../../domain/user/IResource.ts';
import { Permission } from '../../../domain/user/IPermissions.ts';

export class GetTodoList implements IObservableQuery<void, ITodo[]>, IResource {
  resource = 'todo';
  permission: Permission = 'read';

  constructor(@inject(by.key(ITodoStoreKey)) private todoStore: TodoStore) {}

  create(): Observable<ITodo[]> {
    return this.todoStore.getList$();
  }
}

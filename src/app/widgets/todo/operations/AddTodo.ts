import { ICommand } from '../../../../lib/mediator/ICommand.ts';
import { by, inject } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../../domain/todo/TodoStore.ts';
import { IResource } from '../../../domain/user/IResource.ts';
import { Permission } from '../../../domain/user/IPermissions.ts';

export class AddTodo implements ICommand<string>, IResource {
  resource: string = 'todo';
  permission: Permission = 'write';

  constructor(@inject(by.key(ITodoStoreKey)) private todoStore: TodoStore) {}

  async execute(payload: string): Promise<void> {
    this.todoStore.addTodo({ id: Date.now().toString(), title: payload });
  }
}

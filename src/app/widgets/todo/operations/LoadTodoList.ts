import { ITodoStoreKey, TodoStore } from '../../../domain/todo/TodoStore.ts';
import { by, inject } from 'ts-ioc-container';
import { ICommand } from '../../../../lib/mediator/ICommand.ts';
import { Permission } from '../../../domain/user/IPermissions.ts';
import { IResource } from '../../../domain/user/IResource.ts';
import { ITodoRepoKey, TodoRepo } from '../../../domain/todo/TodoRepo.ts';

export class LoadTodoList implements ICommand, IResource {
  resource = 'todo';
  permission: Permission = 'read';

  constructor(
    @inject(by.key(ITodoStoreKey)) private todoStore: TodoStore,
    @inject(by.key(ITodoRepoKey)) private todoRepo: TodoRepo,
  ) {}

  async execute(): Promise<void> {
    const todos = await this.todoRepo.fetchTodos();
    this.todoStore.setList(todos);
  }
}

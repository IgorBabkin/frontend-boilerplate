import { sleep } from '../../../../lib/utils.ts';
import { ITodoStoreKey, TodoStore } from '../../../domain/todo/TodoStore.ts';
import { alias, by, inject, provider, register, visible } from 'ts-ioc-container';
import { ComponentAlias, parentOnly, perScope } from '../../../../lib/scope/container.ts';
import { ICommand } from '../../../../lib/mediator/ICommand.ts';
import { Permission } from '../../../domain/auth/IPermissions.ts';
import { IResource } from '../../../domain/auth/IResource.ts';

@register(alias(ComponentAlias.onMount))
@provider(perScope.application, visible(parentOnly))
export class LoadTodoList implements ICommand, IResource {
  resource = 'todo';
  permission: Permission = 'read';

  constructor(@inject(by.key(ITodoStoreKey)) private todoStore: TodoStore) {}

  async execute(): Promise<void> {
    await sleep(1000);
    this.todoStore.setList([
      { id: '1', title: 'todo 1' },
      { id: '2', title: 'todo 2' },
      { id: '3', title: 'todo 3' },
    ]);
  }
}

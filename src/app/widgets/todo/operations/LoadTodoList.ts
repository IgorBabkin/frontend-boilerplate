import { sleep } from '../../../../lib/utils.ts';
import { ITodoStoreKey, TodoStore } from '../../../domain/todo/TodoStore.ts';
import { by, inject, provider, visible } from 'ts-ioc-container';
import { onMount, parentOnly, perScope } from '../../../../lib/scope/container.ts';
import { IAsyncCommand } from '../../../../lib/mediator/ICommand.ts';
import { when } from '../../../../lib/mediator/IAsyncCondition.ts';
import { HasConfig } from './HasConfig.ts';

@onMount
@when(HasConfig)
@provider(perScope.application, visible(parentOnly))
export class LoadTodoList implements IAsyncCommand {
  constructor(@inject(by.key(ITodoStoreKey)) private todoStore: TodoStore) {}

  async executeAsync(): Promise<void> {
    await sleep(1000);
    this.todoStore.setList([
      { id: '1', title: 'todo 1' },
      { id: '2', title: 'todo 2' },
      { id: '3', title: 'todo 3' },
    ]);
  }
}

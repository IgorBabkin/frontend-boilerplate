import { sleep } from '../../../../lib/utils.ts';
import { TodoStore } from '../../../domain/TodoStore.ts';
import { by, inject, provider, visible } from 'ts-ioc-container';
import { onMount, parentOnly, perScope } from '../../../../lib/scope/container.ts';
import { IAsyncCommand } from '../../../../lib/mediator/ICommand.ts';

@onMount
@provider(perScope.application, visible(parentOnly))
export class LoadTodoList implements IAsyncCommand {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  async executeAsync(): Promise<void> {
    await sleep(1000);
    this.todoStore.setList([
      { id: '1', title: 'todo 1' },
      { id: '2', title: 'todo 2' },
      { id: '3', title: 'todo 3' },
    ]);
  }
}

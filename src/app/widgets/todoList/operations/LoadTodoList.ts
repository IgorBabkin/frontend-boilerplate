import { sleep } from '../../../../lib/utils.ts';
import { TodoStore } from '../../../domain/TodoStore.ts';
import { by, inject } from 'ts-ioc-container';
import { onMount, perScope } from '../../../../lib/scope/container.ts';
import { IAsyncCommand } from '../../../../lib/mediator/ICommand.ts';

@onMount
@perScope('application')
export class LoadTodoList implements IAsyncCommand {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  async executeAsync(): Promise<void> {
    await sleep(1000);
    this.todoStore.setList(['todo 1', 'todo 2', 'todo 3']);
  }
}

import { IAsyncCommand } from '../../IAsyncCommand.ts';
import { sleep } from '../../utils.ts';
import { TodoStore } from './TodoStore.ts';
import { by, inject } from 'ts-ioc-container';
import { onMount, perWidget } from '../../scope/container.ts';

@onMount
@perWidget('TodoListWidget')
export class LoadTodoList implements IAsyncCommand {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  async execute(): Promise<void> {
    await sleep(3000);
    this.todoStore.setList(['todo 1', 'todo 2', 'todo 3']);
  }
}

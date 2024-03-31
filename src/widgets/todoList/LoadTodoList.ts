import { IAsyncCommand } from '../../IAsyncCommand.ts';
import { sleep } from '../../utils.ts';
import { TodoStore } from './TodoStore.ts';
import { by, inject, provider, scope } from 'ts-ioc-container';
import { hasTags, hideFromChildren, onMount } from '../../scope/container.ts';

@onMount
@provider(scope(hasTags.every('widget', 'todoList')), hideFromChildren)
export class LoadTodoList implements IAsyncCommand {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  async execute(): Promise<void> {
    console.log('LoadTodoList -> execute');
    await sleep(3000);
    this.todoStore.items$.next(['todo 1', 'todo 2', 'todo 3']);
  }
}

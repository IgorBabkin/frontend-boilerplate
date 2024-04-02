import { sleep } from '../../../lib/utils.ts';
import { TodoStore } from '../../domain/TodoStore.ts';
import { by, inject } from 'ts-ioc-container';
import { onMount, perWidget } from '../../../lib/scope/container.ts';
import { IQueryHandler } from '../../../lib/mediator/IQueryHandler.ts';

@onMount
@perWidget('TodoListWidget')
export class LoadTodoList implements IQueryHandler {
  constructor(@inject(by.key('ITodoStore')) private todoStore: TodoStore) {}

  async handle(): Promise<void> {
    await sleep(1000);
    this.todoStore.setList(['todo 1', 'todo 2', 'todo 3']);
  }
}

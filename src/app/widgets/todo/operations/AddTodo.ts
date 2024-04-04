import { ICommand } from '../../../../lib/mediator/ICommand.ts';
import { by, inject } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../../domain/todo/TodoStore.ts';

export class AddTodo implements ICommand<string> {
  constructor(@inject(by.key(ITodoStoreKey)) private todoStore: TodoStore) {}

  execute(payload: string): void {
    this.todoStore.addTodo({ id: Date.now().toString(), title: payload });
  }
}

import { by, inject } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '../../domain/todo/TodoRepo.ts';
import { command, query } from '../../../lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { ITodo } from '../../domain/todo/ITodo.ts';

export class TodoController {
  constructor(
    @inject(by.key(ITodoStoreKey)) private todoStore: TodoStore,
    @inject(by.key(ITodoRepoKey)) private todoRepo: TodoRepo,
  ) {}

  @command
  async addTodo(payload: string): Promise<void> {
    this.todoStore.addTodo({ id: Date.now().toString(), title: payload });
  }

  @command
  async loadTodoList(): Promise<void> {
    const todos = await this.todoRepo.fetchTodos();
    this.todoStore.setList(todos);
  }

  @query
  getTodoList$(): Observable<ITodo[]> {
    return this.todoStore.getList$();
  }
}

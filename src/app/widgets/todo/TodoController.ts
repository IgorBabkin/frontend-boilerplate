import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '../../domain/todo/TodoRepo.ts';
import { command, query } from '../../../lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { ITodo } from '../../domain/todo/ITodo.ts';
import { Scope } from '../../../lib/scope/container.ts';
import { IResource } from '../../domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';

export const ITodoControllerKey = Symbol('ITodoController');

@register(key(ITodoControllerKey))
@provider(scope(Scope.application), singleton())
export class TodoController implements IResource {
  resource = 'todo';

  constructor(
    @inject(by.key(ITodoStoreKey)) private todoStore: TodoStore,
    @inject(by.key(ITodoRepoKey)) private todoRepo: TodoRepo,
  ) {}

  @command
  @permission('write')
  async addTodo(payload: string): Promise<void> {
    this.todoStore.addTodo({ id: Date.now().toString(), title: payload });
  }

  @command
  @permission('write')
  async loadTodoList(): Promise<void> {
    const todos = await this.todoRepo.fetchTodos();
    this.todoStore.setList(todos);
  }

  @query
  getTodoList$(): Observable<ITodo[]> {
    return this.todoStore.getList$();
  }
}

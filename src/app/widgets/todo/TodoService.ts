import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '../../domain/todo/TodoRepo.ts';
import { command, query } from '../../../lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { ITodo } from '../../domain/todo/ITodo.ts';
import { Scope } from '../../../lib/scope/container.ts';
import { IResource } from '../../domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';
import { onInit } from '../../../lib/scope/OnInit.ts';
import { service } from '../../../lib/mediator/ServiceProvider.ts';

export const ITodoServiceKey = Symbol('ITodoService');

@register(key(ITodoServiceKey))
@provider(service, scope(Scope.application), singleton())
export class TodoService implements IResource {
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

  @onInit
  @command
  @permission('read')
  async loadTodoList(): Promise<void> {
    const todos = await this.todoRepo.fetchTodos();
    this.todoStore.setList(todos);
  }

  @query
  getTodoList$(): Observable<ITodo[]> {
    return this.todoStore.getList$();
  }
}

import { by, inject, key, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '../../domain/todo/TodoRepo.ts';
import { command, query, service } from '../../../lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { ITodo } from '../../domain/todo/ITodo.ts';
import { OnInit, onInit, Scope } from '../../../lib/scope/container.ts';
import { IResource } from '../../domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';

export const ITodoServiceKey = Symbol('ITodoService');

@service
@register(key(ITodoServiceKey))
@provider(scope(Scope.application), singleton())
export class TodoService implements IResource, OnInit {
  resource = 'todo';
  isInitialized = false;

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

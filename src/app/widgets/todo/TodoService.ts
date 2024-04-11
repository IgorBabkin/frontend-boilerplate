import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '../../domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '../../domain/todo/TodoRepo.ts';
import { action, query } from '@lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { ITodo } from '../../domain/todo/ITodo.ts';
import { Scope } from '@lib/scope/container.ts';
import { IResource } from '../../domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';
import { onInit } from '@lib/scope/OnInit.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { accessor } from '@lib/container/utils.ts';

export const ITodoServiceKey = accessor<ITodoService>(Symbol('ITodoService'));

export interface ITodoService {
  addTodo(payload: string): Promise<void>;

  loadTodoList(): Promise<void>;

  getTodoList$(): Observable<ITodo[]>;
}

@register(ITodoServiceKey.register)
@provider(service, scope(Scope.application), singleton())
export class TodoService implements IResource, ITodoService {
  resource = 'todo';

  constructor(
    @inject(ITodoStoreKey.resolve) private todoStore: TodoStore,
    @inject(ITodoRepoKey.resolve) private todoRepo: TodoRepo,
  ) {}

  @action
  @permission('write')
  async addTodo(payload: string): Promise<void> {
    this.todoStore.addTodo({ id: Date.now().toString(), title: payload });
  }

  @onInit
  @action
  @permission('read')
  async loadTodoList(): Promise<void> {
    const todos = await this.todoRepo.fetchTodos();
    this.todoStore.setList(todos);
  }

  @query getTodoList$(): Observable<ITodo[]> {
    return this.todoStore.getList$();
  }
}

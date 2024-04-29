import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '@domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '@domain/todo/TodoRepo.ts';
import { action, query } from '@lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { ITodo } from '@domain/todo/ITodo.ts';
import { Scope } from '@lib/scope/container.ts';
import { IResource } from '@domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { accessor } from '@lib/container/utils.ts';
import { when } from '@lib/mediator/Condition.ts';
import { isUserLoaded$ } from '../auth/UserService.ts';

export interface ITodoService {
  addTodo(payload: string): Promise<void>;

  loadTodoList(): Promise<void>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: string): Promise<void>;
}

export const ITodoServiceKey = accessor<ITodoService>(Symbol('ITodoService'));

@register(ITodoServiceKey.register, scope(Scope.application))
@provider(service, singleton())
export class TodoService implements IResource, ITodoService {
  resource = 'todo';

  constructor(
    @inject(ITodoStoreKey.resolve) private todoStore: TodoStore,
    @inject(ITodoRepoKey.resolve) private todoRepo: TodoRepo,
  ) {}

  @action
  @permission('write')
  async addTodo(payload: string): Promise<void> {
    const todo = await this.todoRepo.createTodo({ title: payload, description: '' });
    this.todoStore.addTodo(todo);
  }

  @action
  @when(isUserLoaded$)
  @permission('read')
  async loadTodoList(): Promise<void> {
    const todos = await this.todoRepo.fetchTodos();
    this.todoStore.setList(todos);
  }

  @query getTodoList$(): Observable<ITodo[]> {
    return this.todoStore.getList$();
  }

  @action
  async deleteTodo(id: string): Promise<void> {
    await this.todoRepo.deleteTodo(id);
    this.todoStore.deleteTodo(id);
  }
}

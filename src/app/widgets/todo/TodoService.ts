import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '@domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '@domain/todo/TodoRepo.ts';
import { action, query } from '@lib/mediator/ICommand.ts';
import { Observable } from 'rxjs';
import { ITodo } from '@domain/todo/ITodo.ts';
import { Scope } from '@lib/scope/container.ts';
import { IResource } from '@domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';
import { accessor } from '@lib/container/utils.ts';
import { isUserLoaded$ } from '../auth/UserService.ts';
import { service } from '@lib/mediator/ServiceMediator.ts';
import { INotificationStoreKey, NotificationStore } from '@widgets/notifications/NotificationStore.ts';

import { when } from '@lib/initialize/strategies.ts';

import { onStart } from '@lib/initialize/OnInit.ts';

export interface ITodoService {
  addTodo(payload: string): Promise<ITodo>;

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
    @inject(INotificationStoreKey.resolve) private notificationStore: NotificationStore,
  ) {}

  @action
  @permission('write')
  async addTodo(payload: string): Promise<ITodo> {
    const todo = await this.todoRepo.createTodo({ title: payload, description: '' });
    this.todoStore.addTodo(todo);
    this.notificationStore.pushMessage('Todo added');
    return todo;
  }

  @action
  @permission('read')
  @onStart(when(isUserLoaded$))
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

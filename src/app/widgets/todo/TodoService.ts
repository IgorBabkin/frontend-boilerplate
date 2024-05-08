import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '@domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '@domain/todo/TodoRepo.ts';
import { action, query } from '@lib/mediator/operations.ts';
import { Observable } from 'rxjs';
import { type ITodo, type ITodoFilter } from '@domain/todo/ITodo.ts';
import { Scope } from '@lib/scope/container.ts';
import { IResource } from '@domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';
import { accessor } from '@lib/container/utils.ts';
import { isUserLoaded$ } from '../auth/UserService.ts';
import { service } from '@lib/mediator/ServiceProvider.ts';
import { INotificationStoreKey, NotificationStore } from '@widgets/notifications/NotificationStore.ts';

import { onStart, subscribeOn } from '@lib/initialize/OnInit.ts';
import { IPageContextKey } from '@lib/mediator/IPageContext.ts';

export interface ITodoService {
  addTodo(payload: string): Promise<ITodo>;

  loadTodoList(filter: ITodoFilter): Promise<void>;

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
  @onStart(subscribeOn(isUserLoaded$))
  async loadTodoList(@inject(pageContextToFilter) filter: Partial<ITodoFilter>): Promise<void> {
    const todos = await this.todoRepo.fetchTodos(filter);
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

const pageContextToFilter = (s: IContainer): Partial<ITodoFilter> => {
  const pageContext = IPageContextKey.resolve(s);
  return {
    status: pageContext.status,
  };
};

import { IContainer, provider, register, scope, inject, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from '@domain/todo/TodoStore.ts';
import { ITodoRepoKey, TodoRepo } from '@domain/todo/TodoRepo.ts';
import { action, query } from '@lib/components/operations.ts';
import { debounceTime, Observable, switchMap } from 'rxjs';
import { type ITodo } from '@domain/todo/ITodo.ts';
import { Scope } from '@lib/scope/container.ts';
import { IResource } from '@domain/user/IResource.ts';
import { permission } from '../auth/CheckPermission.ts';
import { accessor } from '@lib/container/utils.ts';
import { isUserLoaded$ } from '../auth/UserService.ts';
import { service } from '@lib/components/ServiceProvider.ts';
import { INotificationStoreKey, NotificationStore } from '@widgets/notifications/NotificationStore.ts';

import { onStart, subscribeOn } from '@lib/initialize/OnInit.ts';
import { IPageContextKey } from '@lib/components/IPageContext.ts';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

export interface ITodoService {
  addTodo(payload: string): Promise<ITodo>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: string): Promise<void>;
}

export const ITodoServiceKey = accessor<ITodoService>(Symbol('ITodoService'));

const todosSrc$ = (s: IContainer): Observable<ITodo[]> => {
  const pageContext = IPageContextKey.resolve(s);
  const todoRepo = ITodoRepoKey.resolve(s);

  return pageContext.pipe(
    debounceTime(10),
    switchMap(() => fromPromise(todoRepo.fetchTodos({ status: 'active' }))),
  );
};

@register(ITodoServiceKey.register, scope(Scope.page))
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
  async updateTodoList(@inject(todosSrc$) todos: ITodo[]): Promise<void> {
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

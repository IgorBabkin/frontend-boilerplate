import { IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from './TodoStore';
import { ITodoRepoKey, TodoRepo } from './TodoRepo';
import { debounceTime, Observable, switchMap } from 'rxjs';
import { Scope } from '@framework/scope.ts';
import { IResource } from '../user/IResource';
import { permission } from '@modules/user/CheckPermission';
import { INotificationStoreKey, NotificationStore } from '@modules/notifications/NotificationStore';

import { onStart, subscribeOn } from '@framework/hooks/OnInit';
import { IPageContextKey } from '@context/IPageContext.ts';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { IUserServiceKey } from '../user/IUserService.public';
import { service } from '@framework/service/ServiceProvider.ts';
import { ITodo, ITodoService, ITodoServiceKey } from './ITodoService.public';
import { operation } from '@lib/di/utils.ts';
import { action, query } from '@framework/service/metadata.ts';

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
  @onStart(subscribeOn(operation(IUserServiceKey, (s) => s.hasUser$())))
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

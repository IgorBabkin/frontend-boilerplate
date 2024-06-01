import { IContainer, provider, register, scope, inject, singleton } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStore } from './TodoStore';
import { ITodoRepoKey, TodoRepo } from './TodoRepo';
import { action, query } from '@framework/components/operations';
import { debounceTime, Observable, switchMap } from 'rxjs';
import { type ITodo } from './ITodo';
import { Scope } from '@framework/scope/container';
import { IResource } from '../user/IResource';
import { permission } from '@widgets/CheckPermission';
import { accessor } from '@core/container/utils';
import { isUserLoaded$ } from '@modules/user/UserService';
import { service } from '@framework/components/ServiceProvider';
import { INotificationStoreKey, NotificationStore } from '@modules/notifications/NotificationStore';

import { onStart, subscribeOn } from '@framework/initialize/OnInit';
import { IPageContextKey } from '@framework/components/IPageContext';
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

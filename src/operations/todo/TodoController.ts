import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import {
  ITodo,
  type ITodoService,
  ITodoServiceKey,
  type TodoID,
  TodoStatus,
} from '@services/todo/ITodoService.public.ts';
import {
  type INotificationService,
  INotificationServiceKey,
} from '@services/notifications/INotificationService.public.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { service } from '@lib/di/utils.ts';
import { permission } from '../cross/CheckPermission.ts';
import { onInitAsync, when } from '@framework/hooks/OnInit.ts';
import { IUserServiceKey } from '@services/user/IUserService.public.ts';
import { IResource } from '@services/user/IResource.ts';
import { Observable } from 'rxjs';
import { ITodoController, ITodoControllerKey } from './ITodoController.ts';
import { action } from '@framework/controller/metadata.ts';
import { Scope } from '@framework/scope.ts';
import { type IPageContext, IPageServiceKey } from '@context/IPageService.ts';
import { refreshToken } from '@operations/cross/RefreshToken.ts';

@register(ITodoControllerKey.register, scope(Scope.page))
@provider(controller, singleton())
export class TodoController implements IResource, ITodoController {
  resource = 'todo';

  constructor(
    @inject(ITodoServiceKey.resolve) private todoService: ITodoService,
    @inject(INotificationServiceKey.resolve) private notificationService: INotificationService,
  ) {}

  @action
  @permission('write')
  @refreshToken
  async addTodo(payload: string) {
    await this.todoService.createTodo(payload);
    this.notificationService.showMessage({
      type: 'info',
      title: 'Todo',
      body: 'Todo is created',
    });
  }

  @action
  @permission('read')
  @onInitAsync(when(service(IUserServiceKey, (s) => s.isUserLoaded())))
  async loadTodoList(@inject(service(IPageServiceKey, (s) => s.getContext$())) context: IPageContext): Promise<void> {
    await this.todoService.loadTodoList({ status: (context.searchParams.get('status') as TodoStatus) ?? undefined });
  }

  getTodoList$(): Observable<ITodo[]> {
    return this.todoService.getTodoList$();
  }

  @action
  @permission('write')
  async deleteTodo(id: TodoID): Promise<void> {
    await this.todoService.deleteTodo(id);
    this.notificationService.showMessage({
      type: 'info',
      title: 'Todo',
      body: 'Todo is deleted',
    });
  }
}

import { depKey, IContainer } from 'ts-ioc-container';
import { ITodoStoreKey, TodoStatus } from '@services/todo/ITodoStore.ts';
import { INotificationStoreKey } from '@services/notifications/INotificationService.public.ts';
import { IUserStoreKey } from '@services/user/IUserService.public.ts';
import { switchMap } from 'rxjs';
import { ITodoServiceKey } from './ITodoService.ts';
import { metadata } from '@framework/controller/metadata.ts';
import { type IPageContext, IPageServiceKey } from '@context/IPageService.ts';
import { unsubscribeAll } from '@lib/observable/utils.ts';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

export const TodoService = depKey(ITodoServiceKey).register((s) => {
  const todoStore = ITodoStoreKey.resolve(s);
  const notificationStore = INotificationStoreKey.resolve(s);

  const addTodo = metadata(
    async (payload: string) => {
      await todoStore.createTodo(payload);
      notificationStore.showMessage({
        type: 'info',
        title: 'Todo',
        body: 'Todo is created',
      });
    },
    { refreshToken: true, permissions: ['write'] },
  );

  const deleteTodo = metadata(
    async (id: string) => {
      await todoStore.deleteTodo(id);
      notificationStore.showMessage({
        type: 'info',
        title: 'Todo',
        body: 'Todo is deleted',
      });
    },
    { permissions: ['write'] },
  );

  const getTodoList$ = () => {
    return todoStore.getTodoList$();
  };

  const loadTodoList = metadata(
    async (context: IPageContext) => {
      await this.todoService.loadTodoList({ status: (context.searchParams.get('status') as TodoStatus) ?? undefined });
    },
    { permission: ['read'] },
  );

  const initialize = () => {
    return unsubscribeAll(pageContextOnUserLoaded$(s).subscribe(loadTodoList));
  };

  return {
    resource: 'todo',
    addTodo,
    loadTodoList,
    getTodoList$,
    deleteTodo,
    initialize,
  };
});

const pageContextOnUserLoaded$ = (s: IContainer) =>
  fromPromise(IUserStoreKey.resolve(s).isUserLoaded()).pipe(switchMap(() => IPageServiceKey.resolve(s).getContext$()));

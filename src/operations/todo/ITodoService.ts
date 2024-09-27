import { ITodo } from '@services/todo/ITodoStore.ts';
import { Observable } from 'rxjs';
import { IPageContext } from '@context/IPageService.ts';
import { depKey, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { Initializable } from '@framework/hooks/Initializable.ts';

export interface ITodoService extends Initializable {
  addTodo(payload: string): Promise<void>;

  loadTodoList(context: IPageContext): Promise<void>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: string): Promise<void>;
}

export const ITodoServiceKey = depKey<ITodoService>('ITodoService').pipe(singleton()).when(Scope.page);

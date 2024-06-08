import { ITodo } from '@modules/todo/ITodoService.public.ts';
import { Accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';
import { IPageContext } from '@context/IPageService.ts';

export interface ITodoController {
  addTodo(payload: string): Promise<void>;

  loadTodoList(context: IPageContext): Promise<void>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: string): Promise<void>;
}

export const ITodoControllerKey = new Accessor<ITodoController>('ITodoController');

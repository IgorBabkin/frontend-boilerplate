import { ITodo } from '@services/todo/ITodoService.public.ts';
import { accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';
import { IPageContext } from '@context/IPageService.ts';

export interface ITodoController {
  addTodo(payload: string): Promise<void>;

  loadTodoList(context: IPageContext): Promise<void>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: string): Promise<void>;
}

export const ITodoControllerKey = accessor<ITodoController>('ITodoController');

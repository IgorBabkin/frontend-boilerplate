import { Observable } from 'rxjs';
import { accessor } from '@lib/di/utils.ts';
import { IEntity } from '@lib/observable/IEntity.ts';

export interface ITodo extends IEntity {
  title: string;
}

export type TodoStatus = 'active' | 'completed';

export interface ITodoFilter {
  status: TodoStatus;
}

export type TodoID = string;

export interface ITodoService {
  createTodo(payload: string): Promise<ITodo>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: TodoID): Promise<void>;

  updateTodoList(todos: ITodo[]): void;

  loadTodoList(filter: Partial<ITodoFilter>): Promise<void>;
}

export const ITodoServiceKey = accessor<ITodoService>('ITodoService');

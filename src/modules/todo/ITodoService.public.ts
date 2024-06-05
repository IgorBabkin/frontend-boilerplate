import { Observable } from 'rxjs';
import { Accessor } from '../../lib/di/utils';
import { IEntity } from '../../lib/observable/IEntity';

export interface ITodo extends IEntity {
  title: string;
}

export interface ITodoFilter {
  status: 'active' | 'completed';
}

export interface ITodoService {
  addTodo(payload: string): Promise<ITodo>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: string): Promise<void>;
}

export const ITodoServiceKey = new Accessor<ITodoService>('ITodoService');

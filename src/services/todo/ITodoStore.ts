import { Observable } from 'rxjs';
import { IEntity } from '@lib/observable/IEntity.ts';
import { depKey } from 'ts-ioc-container';

export interface ITodo extends IEntity {
  title: string;
}

export type TodoStatus = 'active' | 'completed';

export interface ITodoFilter {
  status: TodoStatus;
}

export type TodoID = string;

export interface ITodoStore {
  createTodo(payload: string): Promise<ITodo>;

  getTodoList$(): Observable<ITodo[]>;

  deleteTodo(id: TodoID): Promise<void>;

  updateTodoList(todos: ITodo[]): void;

  loadTodoList(filter: Partial<ITodoFilter>): Promise<void>;
}

export const ITodoStoreKey = depKey<ITodoStore>('ITodoStore');

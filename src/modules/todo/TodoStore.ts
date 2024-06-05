import { provider, register, scope, singleton } from 'ts-ioc-container';
import { ObservableList } from '../../lib/observable/ObservableList';
import { Observable } from 'rxjs';
import { Scope } from '@framework/scope.ts';
import { Accessor } from '../../lib/di/utils';
import { ITodo } from './ITodoService.public';

export const ITodoStoreKey = new Accessor<TodoStore>('ITodoStore');

@register(ITodoStoreKey.register, scope(Scope.application))
@provider(singleton())
export class TodoStore {
  private list$ = new ObservableList<ITodo>([]);

  getList$(): Observable<ITodo[]> {
    return this.list$.asObservable();
  }

  setList(list: ITodo[]): void {
    this.list$.setList(list);
  }

  addTodo(payload: ITodo): void {
    this.list$.add(payload);
  }

  deleteTodo(id: string) {
    this.list$.delete(id);
  }
}

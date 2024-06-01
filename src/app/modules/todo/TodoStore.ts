import { provider, register, scope, singleton } from 'ts-ioc-container';
import { ObservableList } from '@core/observable/ObservableList';
import { Observable } from 'rxjs';
import { Scope } from '@framework/scope/container';
import { ITodo } from './ITodo';
import { accessor } from '@core/container/utils';

export const ITodoStoreKey = accessor<TodoStore>(Symbol('ITodoStore'));

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

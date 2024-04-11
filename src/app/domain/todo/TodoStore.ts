import { provider, register, scope, singleton } from 'ts-ioc-container';
import { ObservableList } from '@lib/observable/ObservableList.ts';
import { Observable } from 'rxjs';
import { Scope } from '@lib/scope/container.ts';
import { ITodo } from './ITodo.ts';
import { accessor } from '@lib/container/utils.ts';

export const ITodoStoreKey = accessor<TodoStore>(Symbol('ITodoStore'));

@register(ITodoStoreKey.register)
@provider(scope(Scope.application), singleton())
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
}

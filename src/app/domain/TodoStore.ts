import { key, register } from 'ts-ioc-container';
import { ObservableList } from '../../lib/observable/ObservableList.ts';
import { Observable } from 'rxjs';
import { perApplication } from '../../lib/scope/container.ts';

@perApplication
@register(key('ITodoStore'))
export class TodoStore {
  private list$ = new ObservableList<string>([]);

  getList$(): Observable<string[]> {
    return this.list$.asObservable();
  }

  setList(list: string[]): void {
    this.list$.setList(list);
  }

  addTodo(payload: string): void {
    this.list$.add(payload);
  }
}

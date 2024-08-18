import { ObservableStore } from './ObservableStore';
import { Observer, Subscribable } from 'rxjs';
import { execute, onDispose } from '@framework/hooks/OnInit';
import { Entity } from '@lib/types.ts';

export class ObservableList<T extends Entity> implements Subscribable<T[]> {
  private readonly list$: ObservableStore<T[]>;

  constructor(initial: T[] = []) {
    this.list$ = new ObservableStore<T[]>(initial);
  }

  delete(id: string): this {
    this.list$.map((values) => values.filter((it) => it.id !== id));
    return this;
  }

  add(value: T): this {
    this.list$.map((values) => values.concat(value));
    return this;
  }

  @onDispose(execute())
  clear(): void {
    this.list$.map(() => []);
  }

  next(value: T[]) {
    this.list$.map(() => value);
  }

  error(e: Error) {
    this.list$.error(e);
  }

  complete() {
    this.list$.complete();
  }

  asObservable() {
    return this.list$.asObservable();
  }

  subscribe(props: Partial<Observer<T[]>>) {
    return this.list$.subscribe(props);
  }
}

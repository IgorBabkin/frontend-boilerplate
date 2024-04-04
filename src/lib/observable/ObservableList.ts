import { ObservableStore } from './ObservableStore.ts';
import { IEntity } from './IEntity.ts';
import { map, Observable } from 'rxjs';

export class ObservableList<T extends IEntity> {
  private readonly list$: ObservableStore<T[]>;

  constructor(initial: T[] = []) {
    this.list$ = new ObservableStore<T[]>(initial);
  }

  setList(values: T[]): void {
    this.list$.map(() => values);
  }

  find$(predicate: (value: T) => boolean): Observable<T | undefined> {
    return this.list$.asObservable().pipe(map((values) => values.find(predicate)));
  }

  update(values: T[]): void {
    this.list$.map((current) => {
      const updated = current.map((it) => values.find((v) => v.id === it.id) || it);
      const added = values.filter((v) => !updated.find((it) => it.id === v.id));
      return updated.concat(added);
    });
  }

  delete(id: string): void {
    this.list$.map((values) => values.filter((it) => it.id !== id));
  }

  add(value: T): void {
    this.list$.map((values) => values.concat(value));
  }

  clear(): void {
    this.list$.map(() => []);
  }

  asObservable() {
    return this.list$.asObservable();
  }
}

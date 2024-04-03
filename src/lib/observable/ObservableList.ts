import { ObservableStore } from './ObservableStore.ts';

export class ObservableList<T> {
  private readonly list$: ObservableStore<T[]>;

  constructor(initial: T[] = []) {
    this.list$ = new ObservableStore<T[]>(initial);
  }

  setList(values: T[]): void {
    this.list$.map(() => values);
  }

  add(value: T): void {
    this.list$.map((values) => values.concat(value));
  }

  asObservable() {
    return this.list$.asObservable();
  }
}

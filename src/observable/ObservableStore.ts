import { BehaviorSubject } from 'rxjs';

export class ObservableStore<T> {
  private readonly value$: BehaviorSubject<T>;

  constructor(initial: T) {
    this.value$ = new BehaviorSubject<T>(initial);
  }

  map(fn: (value: T) => T): void {
    this.value$.next(fn(this.value$.getValue()));
  }

  asObservable() {
    return this.value$.asObservable();
  }
}

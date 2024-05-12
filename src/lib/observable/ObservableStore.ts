import { BehaviorSubject } from 'rxjs';
import { execute, onDispose } from '@lib/initialize/OnInit.ts';
import { IObservableStore, IObservableStoreKey } from '@lib/observable/IObservableStore.ts';
import { key, register } from 'ts-ioc-container';

@register(key(IObservableStoreKey))
export class ObservableStore<T> implements IObservableStore<T> {
  private readonly value$: BehaviorSubject<T>;

  constructor(initial: T) {
    this.value$ = new BehaviorSubject<T>(initial);
  }

  map(fn: (value: T) => T): void {
    this.value$.next(fn(this.value$.getValue()));
  }

  getValue() {
    return this.value$.getValue();
  }

  asObservable() {
    return this.value$.asObservable();
  }

  serialize(): string {
    return JSON.stringify(this.getValue());
  }

  @onDispose(execute())
  dispose() {
    this.value$.complete();
  }
}

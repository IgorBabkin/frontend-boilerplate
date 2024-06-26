import { BehaviorSubject } from 'rxjs';
import { execute, onDispose } from '@framework/hooks/OnInit';
import { IObservableStore, IObservableStoreKey } from '../observable/IObservableStore';
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

  setValue(value: T): void {
    this.value$.next(value);
  }

  @onDispose(execute())
  dispose() {
    this.value$.complete();
  }
}

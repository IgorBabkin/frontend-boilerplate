import { Observable, Observer, Subscribable, Unsubscribable } from 'rxjs';

export interface IObservableStore<T> extends Subscribable<T> {
  map(fn: (value: T) => T): void;

  getValue(): T;

  next(value: T): void;

  asObservable(): Observable<T>;

  complete(): void;

  error(e: Error): void;

  subscribe(props: Partial<Observer<T>>): Unsubscribable;

  serialize(): string;
}

export const IObservableStoreKey = Symbol('IObservableStore');

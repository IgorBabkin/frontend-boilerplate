import { Observable } from 'rxjs';

export interface IObservableStore<T> {
  map(fn: (value: T) => T): void;

  getValue(): T;

  setValue(value: T): void;

  asObservable(): Observable<T>;

  dispose(): void;

  serialize(): string;
}

export const IObservableStoreKey = Symbol('IObservableStore');

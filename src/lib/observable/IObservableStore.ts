import { Observable } from 'rxjs';

export interface IObservableStore<T> {
  map(fn: (value: T) => T): void;

  getValue(): T;

  asObservable(): Observable<T>;

  dispose(): void;

  serialize(): string;
}

export const IObservableStoreKey = Symbol('IObservableStore');

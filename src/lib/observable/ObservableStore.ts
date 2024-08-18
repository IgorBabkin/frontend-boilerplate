import { BehaviorSubject, Observable, Observer, OperatorFunction } from 'rxjs';
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

  pipe(): Observable<T>;
  pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
  pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
  pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): Observable<C>;
  pipe<A, B, C, D>(
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
  ): Observable<D>;
  pipe<R>(...args: unknown[]): Observable<R> {
    // eslint-disable-next-line
    // @ts-expect-error
    return this.value$.pipe(...args);
  }

  error(e: Error) {
    this.value$.error(e);
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

  next(value: T): void {
    this.value$.next(value);
  }

  subscribe(props: Partial<Observer<T>>) {
    return this.value$.subscribe(props);
  }

  @onDispose(execute())
  complete() {
    this.value$.complete();
  }
}

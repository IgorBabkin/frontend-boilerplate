import { Observable } from 'rxjs';

export const toObservable = (arg: unknown) => {
  if (arg instanceof Observable) {
    return arg;
  }

  if (arg instanceof Promise) {
    return promiseToObservable(arg);
  }

  return constToObservable(arg);
};

export const promiseToObservable = <T>(promise: Promise<T>) =>
  new Observable<T>((s) => {
    promise
      .then((r) => {
        s.next(r);
        s.complete();
      })
      .catch((e) => s.error(e));
  });

export const constToObservable = <T>(value: T) =>
  new Observable<T>((s) => {
    s.next(value);
    s.complete();
  });

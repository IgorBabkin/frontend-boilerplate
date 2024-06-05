import { Observable } from 'rxjs';

export const toObs$ = (arg: unknown) => {
  if (arg instanceof Observable) {
    return arg;
  }

  if (arg instanceof Promise) {
    return new Observable((s) => {
      arg
        .then((r) => {
          s.next(r);
          s.complete();
        })
        .catch((e) => s.error(e));
    });
  }

  return new Observable((s) => {
    s.next(arg);
    s.complete();
  });
};

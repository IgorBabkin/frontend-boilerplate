import { Observable, scan } from 'rxjs';
import { isRef, Ref, ref } from 'vue';

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

export const toRef = (arg: unknown): Ref<unknown> => {
  if (isRef(arg)) {
    return arg;
  }

  if (arg instanceof Promise) {
    const result = ref(undefined);
    arg.then((r) => {
      result.value = r;
    });

    return result;
  }

  return ref(arg);
};

export const scanToArray = <T>(initial: T[]) =>
  scan<T, T[]>((acc, next) => {
    acc.push(next);
    return acc;
  }, initial);

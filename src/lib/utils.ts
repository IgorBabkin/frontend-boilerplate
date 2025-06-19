import { Observable, Unsubscribable } from 'rxjs';

export const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isPresent = <T>(value: T | undefined | null): value is T => value !== undefined && value !== null;

export function toggleElement<T>(list: T[], id: T) {
  return list.includes(id) ? list.filter((it) => it !== id) : [...list, id];
}

export const generateID = () => Math.random().toString(36).slice(5, 15);

export const lastElementOfArray = <T>(array: T[]): T => array[array.length - 1];

export const isUnsubscribable = (x: unknown): x is Unsubscribable => {
  return x !== undefined && typeof (x as Unsubscribable).unsubscribe === 'function';
};

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

export const toPromise = <T = unknown>(value: T | Promise<T>): Promise<T> => {
  if (value instanceof Promise) {
    return value;
  }
  return Promise.resolve(value);
};

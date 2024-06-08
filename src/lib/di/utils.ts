import { by, DependencyKey, IContainer, InjectFn, IRegistration, key } from 'ts-ioc-container';

export class Accessor<T> {
  constructor(public key: DependencyKey) {}

  register(r: IRegistration) {
    return key(this.key)(r);
  }

  resolve(c: IContainer) {
    return by.key<T>(this.key)(c);
  }
}

export const service =
  <S, R>(accessor: Accessor<S>, fn: (c: S) => R): InjectFn<R> =>
  (c) => {
    return fn(accessor.resolve(c));
  };

export const isClassInstance = (target: unknown): target is object =>
  target !== null && typeof target === 'object' && typeof target.constructor === 'function';

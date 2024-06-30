import { by, DependencyKey, IContainer, InjectFn, IRegistration, key as k } from 'ts-ioc-container';

export class Accessor<T> {
  register: (v: IRegistration) => IRegistration;

  constructor(public key: DependencyKey) {
    this.register = k(this.key);
  }

  resolve(c: IContainer) {
    return by.key<T>(this.key)(c);
  }
}

export const accessor = <T>(key: DependencyKey) => {
  return {
    key,
    resolve: by.key<T>(key),
    register: k(key),
  };
};

export const service =
  <S, R>(accessor: Accessor<S>, fn: (c: S) => R): InjectFn<R> =>
  (c) => {
    return fn(accessor.resolve(c));
  };

export const isClassInstance = (target: unknown): target is object =>
  target !== null && typeof target === 'object' && typeof target.constructor === 'function';

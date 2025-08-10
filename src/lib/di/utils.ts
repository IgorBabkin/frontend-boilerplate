import {
  by,
  DependencyKey,
  DepKey,
  HookFn,
  IContainer,
  IHookContext,
  InjectFn,
  IRegistration,
  key as k,
} from 'ts-ioc-container';
import { constructor } from 'ts-ioc-container/typings/utils';
import { HookClass } from 'ts-ioc-container/typings/hooks/hook';

export class Accessor<T> {
  register: (v: IRegistration) => IRegistration;

  constructor(public key: DependencyKey) {
    this.register = k(this.key);
  }

  resolve(c: IContainer) {
    return by.one<T>(this.key).resolve(c);
  }
}

export const service =
  <S, R>(accessor: DepKey<S>, fn: (c: S) => R): InjectFn<R> =>
  (c) => {
    return fn(accessor.resolve(c));
  };

export const isClassInstance = (target: unknown): target is object =>
  target !== null && typeof target === 'object' && typeof target.constructor === 'function';

export function isHookClass(fn: DecoratorHook): fn is constructor<HookClass> {
  return typeof fn === 'function' && 'execute' in fn.prototype;
}

export function toHookFn(fn: DecoratorHook): HookFn {
  if (isHookClass(fn)) {
    return (context: IHookContext) => {
      const instance = context.scope.resolve(fn);
      return instance.execute(context);
    };
  }
  return fn;
}

export type DecoratorHook = HookFn | constructor<HookClass>;

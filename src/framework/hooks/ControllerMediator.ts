import { getHooks, hook, IContainer } from 'ts-ioc-container';
import { createHookContext } from 'ts-ioc-container/typings/hooks/HookContext';
import { DecoratorHook, toHookFn } from '@lib/di/utils.ts';
import { toPromise } from '@lib/utils.ts';

export class ControllerMediator {
  constructor(private readonly scope: IContainer) {}

  async send<T>(target: T, methodName: string, ...args: unknown[]): Promise<void> {
    const beforeHooks = getHooks(target as object, 'before').get(methodName) ?? [];
    const afterHooks = getHooks(target as object, 'after').get(methodName) ?? [];
    const context = createHookContext(target as object, this.scope, methodName);

    for (const hook of beforeHooks.map(toHookFn)) {
      await toPromise(hook(context));
    }

    await toPromise(target[methodName](...args));

    for (const hook of afterHooks.map(toHookFn)) {
      await toPromise(hook(context));
    }
  }
}

export const before = (...fns: DecoratorHook[]) => hook('before', ...fns);
export const after = (...fns: DecoratorHook[]) => hook('before', ...fns);

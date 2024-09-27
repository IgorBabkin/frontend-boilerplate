import { getHooks, hook } from 'ts-ioc-container';

export const action = hook('action');

export function getActions(target: object) {
  return getHooks(target, 'action');
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const metadata = <TMethod extends Function, TData = unknown>(method: TMethod, value: TData): TMethod => {
  Object.defineProperty(method, '__metadata__', { ...(method['__metadata__'] || {}), ...value });
  return method;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const getMetadata = <TData = unknown>(method: Function): TData | undefined => {
  return method['__metadata__'];
};

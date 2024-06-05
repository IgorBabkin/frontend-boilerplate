/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Hook, IContainer } from 'ts-ioc-container';
import { IObservableStoreKey } from './observable/IObservableStore';
import { ObservableStore } from './observable/ObservableStore';

export const fromLocalStorage =
  <T>(key: string, initial: T) =>
  (c: IContainer) => {
    const item = localStorage.getItem(key);
    return c.resolve(IObservableStoreKey, { args: [item ? JSON.parse(item) : initial] });
  };

export const saveToLocalStorage =
  (key: string): Hook =>
  ({ instance, methodName }) => {
    // @ts-ignore
    const result = instance[methodName];
    if (result instanceof ObservableStore) {
      localStorage.setItem(key, result.serialize());
    }
  };

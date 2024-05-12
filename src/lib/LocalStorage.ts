/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Execution, IContainer } from 'ts-ioc-container';
import { IObservableStoreKey } from '@lib/observable/IObservableStore.ts';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';

export const fromLocalStorage =
  <T>(key: string, initial: T) =>
  (c: IContainer) => {
    const item = localStorage.getItem(key);
    return c.resolve(IObservableStoreKey, { args: [item ? JSON.parse(item) : initial] });
  };

export const saveToLocalStorage =
  (key: string): Execution =>
  ({ instance, methodName }) => {
    // @ts-ignore
    const result = instance[methodName];
    if (result instanceof ObservableStore) {
      localStorage.setItem(key, result.serialize());
    }
  };

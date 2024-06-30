import { Unsubscribe } from '@framework/hooks/OnInit';

export class Metadata<T> {
  constructor(
    private key: string | symbol,
    private getInitial: () => T,
  ) {}

  getMetadata(target: object): T | undefined {
    return Reflect.getMetadata(this.key, target);
  }

  setMetadata(target: object, updateFn: (value: T) => T): void {
    Reflect.defineMetadata(this.key, updateFn(this.getMetadata(target) ?? this.getInitial()), target);
  }

  has(instance: object) {
    return Reflect.hasMetadata(this.key, instance);
  }

  delete(instance: object) {
    Reflect.deleteMetadata(this.key, instance);
  }
}

export const addItemToList = (fn: Unsubscribe) => (items: Unsubscribe[]) => {
  return [...items, fn];
};

export const addItemToMap = (propertyName: string, fn: Unsubscribe) => (items: Unsubscribe[]) => {
  return [...items, fn];
};

export const disposeMetadata = new Metadata<Unsubscribe[]>('__dispose__', () => []);

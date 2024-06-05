import { Unsubscribe } from '@framework/hooks/OnInit';

class Metadata<T> {
  constructor(
    private key: string | symbol,
    private initial: T,
  ) {}

  getMetadata(target: object): T | undefined {
    return Reflect.getOwnMetadata(target, this.key);
  }

  setMetadata(target: object, updateFn: (value: T) => T): void {
    Reflect.defineMetadata(this.key, updateFn(this.getMetadata(target) ?? this.initial), target);
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

export const disposeMetadata = new Metadata<Unsubscribe[]>('__dispose__', []);

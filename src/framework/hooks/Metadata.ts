import { Subscription } from 'rxjs';

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

export const addItemToList = (fn: Subscription) => (items: Subscription[]) => {
  return [...items, fn];
};

export const subscriptionMetadata = new Metadata<Subscription[]>('__dispose__', () => []);

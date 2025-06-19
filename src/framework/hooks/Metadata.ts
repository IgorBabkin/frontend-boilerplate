import { Unsubscribable } from 'rxjs';

export class Metadata<T> {
  constructor(
    private key: string | symbol,
    private getInitial: () => T,
  ) {}

  getMetadata(target: object): T | undefined {
    return Reflect.getMetadata(this.key, target);
  }

  change(target: object, updateFn: (value: T) => T): void {
    Reflect.defineMetadata(this.key, updateFn(this.getMetadata(target) ?? this.getInitial()), target);
  }

  has(instance: object) {
    return Reflect.hasMetadata(this.key, instance);
  }

  delete(instance: object) {
    Reflect.deleteMetadata(this.key, instance);
  }
}

export const Change = {
  append: (subscription: Unsubscribable) => (subscriptions: Unsubscribable[]) => [...subscriptions, subscription],
  delete: (subscription: Unsubscribable) => (subscriptions: Unsubscribable[]) =>
    subscriptions.filter((s) => s !== subscription),
};

export const subscriptionMetadata = new Metadata<Unsubscribable[]>('__dispose__', () => []);

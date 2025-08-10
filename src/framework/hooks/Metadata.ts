import { Unsubscribable } from 'rxjs';

export class Metadata<T> {
  private readonly store = new WeakMap<object, T>();

  constructor(private getInitial: () => T) {}

  getMetadata(target: object): T | undefined {
    return this.store.get(target);
  }

  change(target: object, updateFn: (value: T) => T): void {
    const current = this.store.get(target) ?? this.getInitial();
    this.store.set(target, updateFn(current));
  }

  has(instance: object) {
    return !!this.store.has(instance);
  }

  delete(instance: object) {
    this.store.delete(instance);
  }
}

export const Change = {
  append: (subscription: Unsubscribable) => (subscriptions: Unsubscribable[]) => [...subscriptions, subscription],
  delete: (subscription: Unsubscribable) => (subscriptions: Unsubscribable[]) =>
    subscriptions.filter((s) => s !== subscription),
};

class UnsubscribableMetadata {
  private readonly data = new WeakMap<object, Unsubscribable[]>();

  has(instance: object) {
    return this.data.has(instance);
  }

  set(instance: object, data: Unsubscribable[]) {
    this.data.set(instance, data);
  }

  getSubscriptions(instance: object): Unsubscribable[] {
    return this.data.get(instance) ?? [];
  }

  destroy(instance: object) {
    for (const it of this.data.get(instance)!) {
      it.unsubscribe();
    }
    this.data.delete(instance);
  }
}

export const SUBSCRIPTIONS = new UnsubscribableMetadata();

import { ContextNullError } from './ContextNullError.ts';

export class Context<T> {
  constructor(private value: T | null = null) {}

  setValue(value: T | null): void {
    this.value = value;
  }

  getValueOrFail(): T {
    if (!this.value) {
      throw new ContextNullError('Context value is null');
    }
    return this.value;
  }
}

import { Unsubscribe } from '@lib/initialize/OnInit.ts';

export class Metadata {
  constructor(private key: string | symbol) {}

  deleteMetadata(target: object): void {
    Reflect.deleteMetadata(this.key, target);
  }

  getMetadata(target: object): Unsubscribe[] {
    return Reflect.getOwnMetadata(target, this.key) ?? [];
  }

  hasMetadata(target: object): boolean {
    return Reflect.hasOwnMetadata(this.key, target);
  }

  setMetadata(target: object, updateFn: (value: Unsubscribe[]) => Unsubscribe[]): void {
    Reflect.defineMetadata(this.key, updateFn(this.getMetadata(target)), target);
  }
}

export const initializedMetadata = new Metadata('__isInitialized__');

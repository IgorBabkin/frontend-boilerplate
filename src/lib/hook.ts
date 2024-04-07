export const hook =
  (key: string | symbol): MethodDecorator =>
  (target, propertyKey) => {
    const hooks = Reflect.hasMetadata(key, target.constructor) ? Reflect.getMetadata(key, target.constructor) : [];
    Reflect.defineMetadata(key, [...hooks, propertyKey], target.constructor); // eslint-disable-line @typescript-eslint/ban-types
  };

// eslint-disable-next-line @typescript-eslint/ban-types
export function getHooks(target: Object, key: string | symbol): string[] {
  return Reflect.hasMetadata(key, target.constructor) ? Reflect.getMetadata(key, target.constructor) : [];
}

export const setMethodMetadata =
  (key: string, value: unknown): MethodDecorator =>
  (target, propertyKey) => {
    Reflect.defineMetadata(key, value, target.constructor, propertyKey);
  };

export const getMethodMetadata = (key: string, target: object, propertyKey: string): unknown =>
  Reflect.getMetadata(key, target.constructor, propertyKey);

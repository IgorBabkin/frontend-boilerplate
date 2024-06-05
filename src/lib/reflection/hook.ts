export const setMethodMetadata =
  (key: string, value: unknown): MethodDecorator =>
  (target, propertyKey) => {
    Reflect.defineMetadata(key, value, target.constructor, propertyKey);
  };

export const getMethodMetadata = (key: string, target: object, propertyKey: string): unknown =>
  Reflect.getMetadata(key, target.constructor, propertyKey);

export const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isPresent = <T>(value: T | undefined): value is T => value !== undefined;

export const memoize = <T>(fn: () => T) => {
  let value: T;
  return (): T => {
    if (value === undefined) {
      value = fn();
    }
    return value;
  };
};

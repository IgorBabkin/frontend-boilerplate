export const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isPresent = <T>(value: T | undefined): value is T => value !== undefined;

export function toggleElement<T>(list: T[], id: T) {
  return list.includes(id) ? list.filter((it) => it !== id) : [...list, id];
}

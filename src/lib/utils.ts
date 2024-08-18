export const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isPresent = <T>(value: T | undefined | null): value is T => value !== undefined && value !== null;

export function toggleElement<T>(list: T[], id: T) {
  return list.includes(id) ? list.filter((it) => it !== id) : [...list, id];
}

export const generateID = () => Math.random().toString(36).slice(5, 15);

export const lastElementOfArray = <T>(array: T[]): T => array[array.length - 1];

export const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import { by, IContainer, Tag } from 'ts-ioc-container';
import { Tagged } from 'ts-ioc-container/typings/container/IContainer';

export const hasTags = {
  some:
    (...values: Tag[]) =>
    (c: Tagged) =>
      values.some((v) => c.hasTag(v)),

  every:
    (...values: Tag[]) =>
    (c: Tagged) =>
      values.every((v) => c.hasTag(v)),
};

export const byAliases = {
  some:
    (...values: string[]) =>
    (c: IContainer) =>
      by.aliases((aliases) => values.some((v) => aliases.includes(v)))(c),

  every:
    (...values: string[]) =>
    (c: IContainer) =>
      by.aliases((aliases) => values.every((v) => aliases.includes(v)))(c),
};

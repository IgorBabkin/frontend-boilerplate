import { alias, by, IContainer, provider, register, scope, singleton, Tag, Tagged, visible } from 'ts-ioc-container';

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

export const hideFromChildren = visible(({ isParent }) => isParent);

export const onMount = register(alias('onMount'));

export const perScope = (...tags: string[]) => provider(scope(hasTags.every(...tags)), hideFromChildren);

export const perApplication = provider(
  singleton(),
  scope((c) => c.hasTag('application')),
);

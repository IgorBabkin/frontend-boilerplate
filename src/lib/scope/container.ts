import { alias, by, register, scope, Tag, Tagged } from 'ts-ioc-container';

export const hasTags = {
  every:
    (...values: Tag[]) =>
    (c: Tagged) =>
      values.every((v) => c.hasTag(v)),
};

export const byAliases = {
  loaderPredicate: by.aliases((aliases) => aliases.includes('loader-predicate')),

  onMount: by.aliases((aliases) => aliases.includes('onMount')),
};

export const parentOnly = ({ isParent }: { isParent: boolean }) => isParent;

export const perScope = {
  application: scope(hasTags.every('application')),
  page: scope(hasTags.every('page')),
};

export const onMount = register(alias('onMount'));
export const loaderPredicate = register(alias('loader-predicate'));

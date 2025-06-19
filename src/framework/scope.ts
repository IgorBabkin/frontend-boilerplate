import { by, Tag, Tagged } from 'ts-ioc-container';

export const hasTags = {
  every:
    (...values: Tag[]) =>
    (c: Tagged) =>
      values.every((v) => c.hasTag(v)),
};

export enum CommandAlias {
  onBeforeExecution = 'onBeforeExecution',
  onAfterExecution = 'onAfterExecution',
}

export const byCommandAliases = {
  onBeforeExecution: by.many(CommandAlias.onBeforeExecution),
  onAfterExecution: by.many(CommandAlias.onAfterExecution),
};

export const parentOnly = ({ isParent }: { isParent: boolean }) => isParent;

export const Scope = {
  application: hasTags.every('application'),
  page: hasTags.every('page'),
};

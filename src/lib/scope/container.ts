import { by, Tag, Tagged } from 'ts-ioc-container';

export const hasTags = {
  every:
    (...values: Tag[]) =>
    (c: Tagged) =>
      values.every((v) => c.hasTag(v)),
};

export enum ComponentAlias {
  onMount = 'onComponentMount',
}

export enum CommandAlias {
  onBeforeExecution = 'onCommandBeforeExecution',
}

export const byComponentAliases = {
  onMount: by.aliases((aliases) => aliases.has(ComponentAlias.onMount)),
};

export const byCommandAliases = {
  onBeforeExecution: by.aliases((aliases) => aliases.has(CommandAlias.onBeforeExecution)),
};

export const parentOnly = ({ isParent }: { isParent: boolean }) => isParent;

export const Scope = {
  application: hasTags.every('application'),
  page: hasTags.every('page'),
};

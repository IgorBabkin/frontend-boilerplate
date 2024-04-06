import { by, scope, Tag, Tagged } from 'ts-ioc-container';

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
  onConstruct = 'onCommandConstruct',
  onBeforeExecution = 'onCommandBeforeExecution',
}

export const byComponentAliases = {
  onMount: by.aliases((aliases) => aliases.includes(ComponentAlias.onMount)),
};

export const byCommandAliases = {
  onConstruct: by.aliases((aliases) => aliases.includes(CommandAlias.onConstruct)),
  onBeforeExecution: by.aliases((aliases) => aliases.includes(CommandAlias.onBeforeExecution)),
};

export const parentOnly = ({ isParent }: { isParent: boolean }) => isParent;

export const perScope = {
  application: scope(hasTags.every('application')),
  page: scope(hasTags.every('page')),
};

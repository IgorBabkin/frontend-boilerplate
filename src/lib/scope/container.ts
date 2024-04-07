import { by, Tag, Tagged } from 'ts-ioc-container';
import { getHooks, hook } from '../hook.ts';

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
  onMount: by.aliases((aliases) => aliases.includes(ComponentAlias.onMount)),
};

export const byCommandAliases = {
  onBeforeExecution: by.aliases((aliases) => aliases.includes(CommandAlias.onBeforeExecution)),
};

export const parentOnly = ({ isParent }: { isParent: boolean }) => isParent;

export const Scope = {
  application: hasTags.every('application'),
  page: hasTags.every('page'),
};

export const onConstruct = hook('onConstruct');
export const getConstructHooks = (target: object): string[] => getHooks(target, 'onConstruct') ?? [];

export interface Initializable {
  isInitialized: boolean;
}

export function isInitializable(target: object): target is Initializable {
  return (target as Initializable).isInitialized !== undefined;
}

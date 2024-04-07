import { by, constructor, getMetadata, setMetadata, Tag, Tagged } from 'ts-ioc-container';
import { ICommand } from '../mediator/ICommand.ts';

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

export const onConstruct = (...Commands: constructor<ICommand>[]) => setMetadata('onConstruct', Commands);
export const getOnConstruct = (Target: object): constructor<ICommand>[] => getMetadata(Target, 'onConstruct') ?? [];

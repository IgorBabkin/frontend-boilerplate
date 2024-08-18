import { generateID } from '@lib/utils.ts';

export type ID = string;

export type Identifier = { id: ID };

export type Entity<T = {}> = T & Identifier;

export const createEntity = <T>(payload: T): Entity<T> => ({ ...payload, id: generateID() });

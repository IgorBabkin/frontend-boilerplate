import { generateID } from '@lib/utils.ts';

export type ID = string;

export type Identifier = { id: ID };

export type Entity<T = NonNullable<unknown>> = T & Identifier;

export const createEntity = <T>(payload: T): Entity<T> => ({ ...payload, id: generateID() });

export type TimeoutID = ReturnType<typeof setTimeout>;

export type Branded<T, B> = T & { __brand: B };

export type Predicate<T> = (c: T) => boolean;

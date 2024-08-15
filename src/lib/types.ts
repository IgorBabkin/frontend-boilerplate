import { generateID } from '@lib/utils.ts';

export type Entity<T> = T & { id: string };

export const createEntity = <T>(payload: T): Entity<T> => ({ ...payload, id: generateID() });

import { Entity, ID, Identifier } from '@lib/types.ts';
import { generateID } from '@lib/utils.ts';
import { BehaviorSubject } from 'rxjs';

export type PatchPayload<Entity extends Identifier> = Entity | ID;
export type EntityPatch<T extends Identifier> = {
  type: 'append' | 'remove';
  value: PatchPayload<T>;
};
export const isAppendDiff = <T extends { id: ID }>(diff: EntityPatch<T>): diff is { type: 'append'; value: T } =>
  diff.type === 'append';
export const isRemoveDiff = <T extends { id: ID }>(diff: EntityPatch<T>): diff is { type: 'remove'; value: ID } =>
  diff.type === 'remove';
export const createPatch = <T>(payload: T): EntityPatch<Entity<T>> => ({
  type: 'append',
  value: { ...payload, id: generateID() },
});

export const patchSubject = <T extends Identifier>(target$: BehaviorSubject<T[]>, diff: EntityPatch<T>) => {
  if (isAppendDiff(diff)) {
    target$.next(target$.value.concat(diff.value));
    return;
  }

  if (isRemoveDiff(diff)) {
    target$.next(target$.value.filter((v) => v.id !== diff.value));
    return;
  }
};

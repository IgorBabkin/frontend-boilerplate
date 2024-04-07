import { getHooks, hook } from '../hook.ts';
import { getTags } from '../mediator/ICommand.ts';

export const onInit = hook('onInit');
export const getOnInitHooks = (target: object): string[] => getHooks(target, 'onInit') ?? [];

export interface OnInit {
  isInitialized: boolean;
}

export function isInitializable(target: object): target is OnInit {
  return (target as OnInit).isInitialized !== undefined || getTags(target).includes('OnInit');
}

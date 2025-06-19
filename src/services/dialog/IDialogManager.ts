import { depKey, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@framework/scope.ts';
import { BehaviorSubject, Observable } from 'rxjs';

export enum AppDialogKey {
  login = 'login',
  register = 'register',
  forgotPassword = 'forgotPassword',
}

export interface IDialogManager {
  toggleDialog(key: AppDialogKey, show?: boolean): void;

  isDialogVisible$(key: AppDialogKey): Observable<boolean>;
}

export const IDialogManagerKey = depKey<IDialogManager>('IDialogManager');

@register(IDialogManagerKey, scope(Scope.application), singleton(), 'required')
export class DialogManager implements IDialogManager {
  private isVisibleState = new Map<AppDialogKey, BehaviorSubject<boolean>>();

  constructor() {}

  isDialogVisible$(key: AppDialogKey): Observable<boolean> {
    return this.findOrCreate(key);
  }

  toggleDialog(key: AppDialogKey, show?: boolean) {
    const state = this.findOrCreate(key);
    state.next(show ?? !state.value);
  }

  private findOrCreate(key: AppDialogKey): BehaviorSubject<boolean> {
    if (!this.isVisibleState.has(key)) {
      this.isVisibleState.set(key, new BehaviorSubject(false));
    }
    return this.isVisibleState.get(key) as BehaviorSubject<boolean>;
  }
}

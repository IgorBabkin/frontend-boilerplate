import { Unsubscribe } from '@framework/hooks/OnInit.ts';
import { AppDialogKey } from '@services/dialog/IDialogManager.ts';
import { Subscribable } from 'rxjs';
import { depKey, singleton } from 'ts-ioc-container';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { Scope } from '@framework/scope.ts';
import { Initializable } from '@framework/hooks/Initializable.ts';

export interface IDialogService extends Initializable {
  init(): void | Unsubscribe;

  showDialog(key: AppDialogKey): void;

  closeDialog(key: AppDialogKey): void;

  isDialogVisible$(login: AppDialogKey): Subscribable<boolean>;
}

export const IDialogServiceKey = depKey<IDialogService>('IDialogService')
  .pipe(controller, singleton())
  .when(Scope.application);

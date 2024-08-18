import { action } from '@framework/controller/metadata.ts';
import { onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { UserIsNotLoggedInError } from '@framework/errors/UserIsNotLoggedInError.ts';
import { AppDialogKey, type IDialogManager, IDialogManagerKey } from '@services/dialog/IDialogManager.ts';
import { by, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Controller } from '@framework/controller/Controller.ts';
import { accessor, service } from '@lib/di/utils.ts';
import { Scope } from '@framework/scope.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { map, Subscribable } from 'rxjs';

export interface IDialogController {
  showDialog(key: AppDialogKey): void;

  closeDialog(key: AppDialogKey): void;

  isDialogVisible$(login: AppDialogKey): Subscribable<boolean>;
}
export const IDialogControllerKey = accessor<IDialogController>('IDialogController');

@provider(controller, singleton())
@register(IDialogControllerKey.register, scope(Scope.application))
export class DialogController extends Controller implements IDialogController {
  constructor(
    @inject(by.scope.current) scope: IContainer,
    @inject(IDialogManagerKey.resolve) private dialogManager: IDialogManager,
  ) {
    super(scope);
  }

  @action
  @onInit(subscribeOn())
  showDialog(
    @inject(
      service(IErrorServiceKey, (s) => s.filter$(UserIsNotLoggedInError.match).pipe(map(() => AppDialogKey.login))),
    )
    key: AppDialogKey,
  ) {
    this.dialogManager.toggleDialog(key, true);
  }

  @action
  closeDialog(key: AppDialogKey) {
    this.dialogManager.toggleDialog(key, false);
  }

  isDialogVisible$(key: AppDialogKey): Subscribable<boolean> {
    return this.dialogManager.isDialogVisible$(key);
  }
}

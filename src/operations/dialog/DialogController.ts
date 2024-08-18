import { Controller } from '@framework/controller/Controller.ts';
import { alias, by, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { Scope } from '@framework/scope.ts';
import { accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';
import { AppDialogKey, type IDialogManager, IDialogManagerKey } from '@services/dialog/IDialogManager.ts';
import { onInit, subscribeOn } from '@framework/hooks/OnInit.ts';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { UserIsNotLoggedInError } from '@services/dialog/UserIsNotLoggedInError.ts';

export interface IDialogController {
  isAuthDialogVisible$: Observable<boolean>;
  closeAuthDialog(): void;
}

export const IDialogControllerKey = accessor<IDialogController>('IDialogController');

@provider(controller, singleton(), alias('required'))
@register(IDialogControllerKey.register, scope(Scope.application))
export class DialogController extends Controller implements IDialogController {
  isAuthDialogVisible$ = this.dialogManager.isDialogVisible$(AppDialogKey.login);

  constructor(
    @inject(by.scope.current) scope: IContainer,
    @inject(IDialogManagerKey.resolve) private dialogManager: IDialogManager,
  ) {
    super(scope);
  }

  @onInit(subscribeOn({ targets$: [(s) => IErrorServiceKey.resolve(s).filter$(UserIsNotLoggedInError.match)] }))
  showAuthDialog() {
    this.dialogManager.toggleDialog(AppDialogKey.login, true);
  }

  closeAuthDialog() {
    this.dialogManager.toggleDialog(AppDialogKey.login, false);
  }
}

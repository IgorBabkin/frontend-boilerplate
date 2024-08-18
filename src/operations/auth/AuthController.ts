import { Controller } from '@framework/controller/Controller.ts';
import { alias, by, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { type IAuthService } from '@services/auth/IAuthService.public.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { Scope } from '@framework/scope.ts';
import { accessor, service } from '@lib/di/utils.ts';
import { onInit, onInitAsync, subscribeOn } from '@framework/hooks/OnInit.ts';
import { filter, map, Subscribable } from 'rxjs';
import { skipWhileBusy } from '@lib/observable/utils.ts';
import { type ITabsChannel, ITabsChannelKey, logoutMessage } from '@services/tabs/ITabsChannel.ts';
import { LogoutError, type LogoutReason } from '@context/errors/LogoutError.ts';
import { TokenError } from '@framework/errors/TokenError.ts';
import { action } from '@framework/controller/metadata.ts';
import { type IAlertService, IAlertServiceKey } from '@services/alert/IAlertService.ts';
import { UserIsNotLoggedInError } from '@framework/errors/UserIsNotLoggedInError.ts';
import { AppDialogKey, type IDialogManager, IDialogManagerKey } from '@services/dialog/IDialogManager.ts';

export interface IAuthController {
  isLoginDialogVisible$: Subscribable<boolean>;

  login(login: string, password: string): Promise<void>;

  logout(): Promise<void>;

  closeAuthDialog(): void;
}

export const IAuthControllerKey = accessor<IAuthController>('IAuthController');

@provider(controller, singleton(), alias('required'))
@register(IAuthControllerKey.register, scope(Scope.application))
export class AuthController extends Controller implements IAuthController {
  isLoginDialogVisible$ = this.dialogManager.isDialogVisible$(AppDialogKey.login);

  constructor(
    @inject(by.scope.current) scope: IContainer,
    @inject(IErrorServiceKey.resolve) private authService: IAuthService,
    @inject(ITabsChannelKey.resolve) private tabsChannel: ITabsChannel,
    @inject(IAlertServiceKey.resolve) private alertService: IAlertService,
    @inject(IDialogManagerKey.resolve) private dialogManager: IDialogManager,
  ) {
    super(scope);
  }

  @onInitAsync(
    subscribeOn({
      targets$: [(s) => IErrorServiceKey.resolve(s).error$.pipe(filter(TokenError.match))],
    }),
  )
  @skipWhileBusy
  async refreshAccessToken(): Promise<void> {
    await this.authService.refreshToken();
  }

  @action
  async login(login: string, password: string): Promise<void> {
    await this.authService.login(login, password);
  }

  @action
  @onInit(subscribeOn())
  async autologout(
    @inject(
      service(IErrorServiceKey, (s) =>
        s.error$.pipe(
          filter(LogoutError.match),
          map((e) => e.logoutReason),
        ),
      ),
    )
    reason: LogoutReason,
  ): Promise<void> {
    await this.authService.logout(reason.isSessionAlreadyClosed);
    if (!reason.isSessionAlreadyClosed) {
      this.tabsChannel.dispatch(logoutMessage());
    }

    this.alertService.addAlert({
      title: 'Error',
      type: 'error',
      body: reason.message,
      showLoginButton: reason.showLoginButton,
    });
  }

  @action
  async logout(): Promise<void> {
    await this.authService.logout();
    this.tabsChannel.dispatch(logoutMessage());
  }

  @action
  @onInit(subscribeOn({ targets$: [(s) => IErrorServiceKey.resolve(s).filter$(UserIsNotLoggedInError.match)] }))
  showAuthDialog() {
    this.dialogManager.toggleDialog(AppDialogKey.login, true);
  }

  @action
  closeAuthDialog() {
    this.dialogManager.toggleDialog(AppDialogKey.login, false);
  }
}

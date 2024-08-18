import { Controller } from '@framework/controller/Controller.ts';
import { alias, by, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { type IAuthService } from '@services/auth/IAuthService.public.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { Scope } from '@framework/scope.ts';
import { accessor, service } from '@lib/di/utils.ts';
import { execute, onInit, onInitAsync, subscribeOn } from '@framework/hooks/OnInit.ts';
import { filter, map, Observable } from 'rxjs';
import { InvalidAccessTokenError } from '@framework/errors/InvalidAccessTokenError.ts';
import { EmptyTokenError } from '@services/auth/EmptyTokenError.ts';
import { skipWhileBusy } from '@lib/observable/utils.ts';
import { LogoutError, type LogoutReason } from '@context/errors/DomainError.ts';
import { logoutMessage, type ITabsChannel, ITabsChannelKey } from '@services/tabs/ITabsChannel.ts';

export interface IAuthController {
  isLoginDialogVisible$: Observable<boolean>;

  login(login: string, password: string): Promise<void>;

  logout(reason: LogoutReason): Promise<void>;
}

export const IAuthControllerKey = accessor<IAuthController>('IAuthController');

@provider(controller, singleton(), alias('required'))
@register(IAuthControllerKey.register, scope(Scope.application))
export class AuthController extends Controller implements IAuthController {
  isLoginDialogVisible$: Observable<boolean>;

  constructor(
    @inject(by.scope.current) scope: IContainer,
    @inject(IErrorServiceKey.resolve) private authService: IAuthService,
    @inject(ITabsChannelKey.resolve) private tabsChannel: ITabsChannel,
  ) {
    super(scope);
    this.isLoginDialogVisible$ = authService.isAuthDialogVisible$;
  }

  @onInitAsync(execute())
  @onInitAsync(
    subscribeOn({
      targets$: [
        (s) =>
          IErrorServiceKey.resolve(s).error$.pipe(
            filter((e) => e instanceof EmptyTokenError || e instanceof InvalidAccessTokenError),
          ),
      ],
    }),
  )
  @skipWhileBusy
  async refreshAccessToken(): Promise<void> {
    await this.authService.refreshToken();
  }

  async login(login: string, password: string): Promise<void> {
    await this.authService.login(login, password);
  }

  @onInit(subscribeOn())
  async logout(
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
    await this.authService.logout(reason);
    if (reason.closeSession) {
      this.tabsChannel.dispatch(logoutMessage(reason));
    }
  }
}

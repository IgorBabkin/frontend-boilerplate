import { Controller } from '@framework/controller/Controller.ts';
import { alias, type IContainer, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { type IAuthService } from '@services/auth/IAuthService.public.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { Scope } from '@framework/scope.ts';
import { accessor } from '@lib/di/utils.ts';
import { execute, onInit, onInitAsync, subscribeOn } from '@framework/hooks/OnInit.ts';
import { filter, Observable } from 'rxjs';
import { InvalidAccessTokenError } from '@framework/errors/InvalidAccessTokenError.ts';
import { EmptyTokenError } from '@services/auth/EmptyTokenError.ts';
import { skipWhileBusy } from '@lib/observable/utils.ts';
import { SessionClosedError } from '@operations/auth/SessionClosedError.ts';

export interface IAuthController {
  isLoginDialogVisible$: Observable<boolean>;

  login(login: string, password: string): Promise<void>;

  logout(locallyOnly?: boolean): Promise<void>;
}

export const IAuthControllerKey = accessor<IAuthController>('IAuthController');

@provider(controller, singleton(), alias('required'))
@register(IAuthControllerKey.register, scope(Scope.application))
export class AuthController extends Controller implements IAuthController {
  isLoginDialogVisible$: Observable<boolean>;

  constructor(
    scope: IContainer,
    @inject(IErrorServiceKey.resolve) private authService: IAuthService,
  ) {
    super(scope);
    this.isLoginDialogVisible$ = authService.isLoginVisible$;
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

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  @onInit(
    subscribeOn({
      targets$: [(s) => IErrorServiceKey.resolve(s).error$.pipe(filter((i) => i instanceof SessionClosedError))],
    }),
  )
  showAuthDialog(): void {
    this.authService.showAuthDialog();
  }
}

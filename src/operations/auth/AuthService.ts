import { alias, depKey, type IContainer, singleton } from 'ts-ioc-container';
import { IErrorServiceKey } from '@framework/errors/IErrorService.public.ts';
import { controller } from '@framework/controller/ControllerProvider.ts';
import { Scope } from '@framework/scope.ts';
import { filter } from 'rxjs';
import { skipWhileBusy } from '@lib/observable/utils.ts';
import { ITabsChannelKey, logoutMessage } from '@services/tabs/ITabsChannel.ts';
import { LogoutError, type LogoutReason } from '@context/errors/LogoutError.ts';
import { TokenError } from '@framework/errors/TokenError.ts';
import { AccessToken, AuthCredentials, IAuthProviderKey } from '@services/auth/IAuthProvider.ts';
import { ObservableStore } from '@lib/observable/ObservableStore.ts';
import { action } from '@framework/hooks/OnViewInit.ts';

export interface IAuthService {
  login(credentials: AuthCredentials): Promise<void>;

  logout(): Promise<void>;
}

export const IAuthServiceKey = depKey<IAuthService>('IAuthService')
  .pipe(controller(), singleton())
  .when(Scope.application);

export const AuthService = IAuthServiceKey.register((s) => {
  const authProvider = IAuthProviderKey.resolve(s);
  const tabsChannel = ITabsChannelKey.resolve(s);

  const accessToken = new ObservableStore<AccessToken | null>(null);

  const refreshToken = action(
    skipWhileBusy(async () => {
      const token = await authProvider.refreshToken();
      accessToken.next(token);
    }),
    { subscribeOn: (c: IContainer) => IErrorServiceKey.resolve(c).error$.pipe(filter(TokenError.match)) },
  );

  const login = action(async (credentials: AuthCredentials) => {
    const token = await authProvider.authenticate(credentials);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const [creds$, token$] = useRepoMessage((creds: AuthCredentials) => fromPromise(authProvider.authenticate(creds)));
    accessToken.next(token);
  });

  const logout = action(async () => {
    if (accessToken$.getValue() === undefined) {
      return;
    }

    accessToken$.next(undefined);
    await this.authProvider.closeSession();

    tabsChannel.dispatch(logoutMessage());
  });

  const logoutByReason = action(
    async (reason: LogoutReason) => {
      if (accessToken$.getValue() === undefined) {
        return;
      }

      accessToken$.next(undefined);
      if (!reason.isSessionAlreadyClosed) {
        await this.authProvider.closeSession(reason.isSessionAlreadyClosed);
      }

      tabsChannel.dispatch(logoutMessage());
    },
    { subscribeOn: (c: IContainer) => IErrorServiceKey.resolve(c).error$.pipe(filter(LogoutError.match)) },
  );

  return {
    login,
    logout,
    refreshToken,
    logoutByReason,
  };
});

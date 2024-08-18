import { accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';
import { AccessToken } from '@services/auth/IAuthProvider.ts';
import { LogoutReason } from '@context/errors/DomainError.ts';

export interface IAuthService {
  isAuthDialogVisible$: Observable<boolean>;

  closeAuthDialog(): void;

  login(login: string, password: string): Promise<void>;

  logout(reason: LogoutReason): Promise<void>;

  refreshToken(): Promise<AccessToken>;

  accessToken$: Observable<string | undefined>;

  getTokenOrFail(): string;

  setToken(token: string): void;
}

export const IAuthServiceKey = accessor<IAuthService>('IAuthService');

import { accessor } from '@lib/di/utils.ts';
import { AuthProvider } from '@services/auth/AuthProvider.ts';
import { Branded } from '@lib/types.ts';

export const IAuthProviderKey = accessor<AuthProvider>('IAuthProvider');

export type AccessToken = Branded<string, 'AccessToken'>;
export type Username = Branded<string, 'Username'>;
export type Password = Branded<string, 'Password'>;
export type AuthCredentials = {
  username: Username;
  password: Password;
};

export interface IAuthProvider {
  authenticate(credentials: AuthCredentials): Promise<AccessToken>;

  refreshToken(): Promise<AccessToken>;

  closeSession(): Promise<void>;
}

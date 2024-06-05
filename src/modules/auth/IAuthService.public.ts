import { Accessor } from '../../lib/di/utils';

export interface IAuthService {
  login(): Promise<void>;
}

export const IAuthServiceKey = new Accessor<IAuthService>('IAuthService');

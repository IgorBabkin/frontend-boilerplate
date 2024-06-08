import { Accessor } from '@lib/di/utils.ts';
import { Observable } from 'rxjs';
import { IUser } from '../services/user/IUser.ts';

export interface IUserController {
  getUser$(): Observable<IUser | undefined>;
}

export const IUserControllerKey = new Accessor<IUserController>('IUserController');

import { IUser } from '@services/user/IUser.ts';
import { ProfileRepo } from '@services/user/ProfileRepo.ts';
import { depKey } from 'ts-ioc-container';

export interface IProfileRepo {
  fetchUser(token: string): Promise<IUser>;
}

export const IProfileRepoKey = depKey<ProfileRepo>('IProfileRepo');

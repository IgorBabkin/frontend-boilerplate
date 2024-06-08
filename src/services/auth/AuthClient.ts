import { sleep } from '@lib/utils.ts';
import { Accessor } from '@lib/di/utils.ts';

function randomString(): string {
  return Math.random().toString(36).substring(7);
}

export const IAuthClientKey = new Accessor<AuthClient>('IAuthClient');

export class AuthClient {
  async login(username: string, password: string): Promise<string> {
    console.log('authenticating...', username, password);
    await sleep(1000);
    return randomString();
  }
}

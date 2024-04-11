import { sleep } from '@lib/utils.ts';
import { accessor } from '@lib/container/utils.ts';

export interface TodoDTO {
  id: string;
  name: string;
}

export interface UserDTO {
  nickname: string;
  permissions: Record<string, ('read' | 'write')[]>;
}

export const IApiClientKey = accessor<ApiClient>(Symbol('IApiClient'));

export class ApiClient {
  constructor(private token: string) {}

  async getUser(): Promise<UserDTO> {
    console.log('getting user...', this.token);
    await sleep(1000);
    return { nickname: 'ironman', permissions: { todo: ['read', 'write'] } };
  }

  async getTodos(): Promise<TodoDTO[]> {
    console.log('getting todos...', this.token);
    await sleep(1000);
    return [
      { id: '1', name: 'Buy milk' },
      { id: '2', name: 'Buy bread' },
      { id: '3', name: 'Buy butter' },
    ];
  }
}

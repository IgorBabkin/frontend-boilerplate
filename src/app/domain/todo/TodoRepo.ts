import { ITodo } from './ITodo.ts';
import { mapNetworkToDomainError } from '../../api/mapApiToDomainError.ts';
import { by, inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '../../../lib/scope/container.ts';
import { ApiClient, IApiClientKey, TodoDTO } from '../../api/ApiClient.ts';
import { Context } from '../../../lib/scope/Context.ts';
import { accessor } from '../../../lib/container/utils.ts';

export const ITodoRepoKey = accessor<TodoRepo>(Symbol('ITodoRepo'));

@register(ITodoRepoKey.register)
@provider(scope(Scope.application), singleton())
export class TodoRepo {
  static toDomain(todo: TodoDTO): ITodo {
    return {
      id: todo.id,
      title: todo.name,
    };
  }

  constructor(@inject(by.key(IApiClientKey)) private apiClient: Context<ApiClient>) {}

  @mapNetworkToDomainError
  async fetchTodos(): Promise<ITodo[]> {
    const todos = await this.apiClient.getValueOrFail().getTodos();
    return todos.map(TodoRepo.toDomain);
  }
}

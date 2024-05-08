import { ITodo, ITodoFilter } from './ITodo.ts';
import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { Scope } from '@lib/scope/container.ts';
import { IApiClientKey } from '../../api/ApiClient.ts';
import { accessor } from '@lib/container/utils.ts';
import { ApiClient, Todo } from '@ibabkin/backend-template';
import { repository } from '@lib/mediator/RepositoryProvider.ts';

export const ITodoRepoKey = accessor<TodoRepo>(Symbol('ITodoRepo'));

@register(ITodoRepoKey.register, scope(Scope.application))
@provider(repository, singleton())
export class TodoRepo {
  static toDomain(todo: Todo): ITodo {
    return {
      id: todo.id,
      title: todo.title,
    };
  }

  constructor(@inject(IApiClientKey.resolve) private apiClient: ApiClient) {}

  async fetchTodos(filter: Partial<ITodoFilter>): Promise<ITodo[]> {
    const todos = await this.apiClient.listTodo({
      status: filter.status,
    });
    return todos.map(TodoRepo.toDomain);
  }

  async createTodo({ title, description }: { description: string; title: string }) {
    const todo = await this.apiClient.addTodo({ body: { title, description } });
    return TodoRepo.toDomain(todo);
  }

  async deleteTodo(id: string) {
    await this.apiClient.deleteTodo({ params: { id } });
  }
}

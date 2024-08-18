import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoRepoKey, TodoRepo } from './TodoRepo';
import { Observable } from 'rxjs';
import { Scope } from '@framework/scope.ts';
import { ITodo, ITodoFilter, ITodoService, ITodoServiceKey } from './ITodoService.public';
import { ObservableList } from '@lib/observable/ObservableList.ts';
import { watch } from '@lib/watch/watch.ts';
import { Service } from '@framework/service/Service.ts';

@register(ITodoServiceKey.register, scope(Scope.page))
@provider(singleton())
export class TodoService extends Service implements ITodoService {
  @watch
  private todoList$ = new ObservableList<ITodo>([]);

  constructor(@inject(ITodoRepoKey.resolve) private todoRepo: TodoRepo) {
    super();
  }

  async createTodo(payload: string): Promise<ITodo> {
    const todo = await this.todoRepo.createTodo({ title: payload, description: '' });
    this.todoList$.add(todo);
    return todo;
  }

  updateTodoList(todos: ITodo[]): void {
    this.todoList$.next(todos);
  }

  getTodoList$(): Observable<ITodo[]> {
    return this.todoList$.asObservable();
  }

  async deleteTodo(id: string): Promise<void> {
    await this.todoRepo.deleteTodo(id);
    this.todoList$.delete(id);
  }

  async loadTodoList(filter: Partial<ITodoFilter>): Promise<void> {
    const todos = await this.todoRepo.fetchTodos(filter);
    this.todoList$.next(todos);
  }
}

import { inject, provider, register, scope, singleton } from 'ts-ioc-container';
import { ITodoRepoKey, TodoRepo } from './TodoRepo';
import { BehaviorSubject, Observable } from 'rxjs';
import { Scope } from '@framework/scope.ts';
import { ITodo, ITodoFilter, ITodoStore, ITodoStoreKey } from './ITodoStore.ts';
import { watch } from '@lib/watch/watch.ts';
import { Store } from '@framework/service/Store.ts';

@register(ITodoStoreKey.register, scope(Scope.page))
@provider(singleton())
export class TodoStore extends Store implements ITodoStore {
  @watch
  private todoList$ = new BehaviorSubject<ITodo[]>([]);

  constructor(@inject(ITodoRepoKey.resolve) private todoRepo: TodoRepo) {
    super();
  }

  async createTodo(payload: string): Promise<ITodo> {
    const todo = await this.todoRepo.createTodo({ title: payload, description: '' });
    this.todoList$.next([...this.todoList$.value, todo]);
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
    this.todoList$.next(this.todoList$.value.filter((todo) => todo.id !== id));
  }

  async loadTodoList(filter: Partial<ITodoFilter>): Promise<void> {
    const todos = await this.todoRepo.fetchTodos(filter);
    this.todoList$.next(todos);
  }
}

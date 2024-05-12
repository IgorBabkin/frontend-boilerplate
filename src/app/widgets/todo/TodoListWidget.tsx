import { ITodoServiceKey } from './TodoService.ts';
import { useObservable } from '@lib/observable/observable.ts';
import { widget } from '@lib/scope/components.tsx';
import Button from '@ui/button/Button.tsx';
import { useAsyncEventHandler } from '@lib/scope/useQuery.ts';
import { IFavoritesServiceKey } from '@widgets/todo/FavoritesService.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';

const TodoListWidget = widget(() => {
  const todoService = useDependency(ITodoServiceKey.resolve);
  const favoritesService = useDependency(IFavoritesServiceKey.resolve);

  const list = useObservable(() => todoService.getTodoList$(), [], [todoService]);
  const deleteTodo = useAsyncEventHandler((id: string) => todoService.deleteTodo(id), [todoService]);
  const favorites = useObservable(() => favoritesService.getFavorites$(), [], [favoritesService]);

  return (
    <ul>
      {list.map((it) => (
        <li key={it.id}>
          {it.title} - {favorites.includes(it.id) ? 'Favorite' : 'Not favorite'}
          <Button type="button" onClick={() => deleteTodo(it.id)}>
            Delete
          </Button>
          <Button type="button" onClick={() => favoritesService.toggleFavorite(it.id)}>
            {favorites.includes(it.id) ? 'Remove from favorites' : 'Add to favourite'}
          </Button>
        </li>
      ))}
    </ul>
  );
}, 'TodoListWidget');

export default TodoListWidget;

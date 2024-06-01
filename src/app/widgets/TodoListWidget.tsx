import { ITodoServiceKey } from '@modules/todo/TodoService';
import { useObservable } from '@core/observable/observable';
import { widget } from '@framework/scope/components';
import Button from '@ui/button/Button';
import { useAsyncEventHandler } from '@framework/scope/useQuery';
import { IFavoritesServiceKey } from '@modules/todo/FavoritesService';
import { useDependency } from '@framework/scope/ScopeContext';

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

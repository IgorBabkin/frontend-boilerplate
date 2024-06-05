import { useAsyncEventHandler, useObservable } from '@helpers/observable';
import { widget } from '@helpers/scope/components';
import Button from '@ui/button/Button';
import { useDependency } from '@helpers/scope/ScopeContext';
import { ITodoServiceKey } from '@modules/todo/ITodoService.public';
import { IFavoritesServiceKey } from '@modules/todo/IFavoritesService.public';

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

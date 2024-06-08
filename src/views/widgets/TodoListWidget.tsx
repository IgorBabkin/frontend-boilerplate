import { useAsyncEventHandler, useObservable } from '@helpers/observable';
import { widget } from '@helpers/scope/components';
import Button from '@ui/button/Button';
import { useDependency } from '@helpers/scope/ScopeContext';
import { ITodoControllerKey } from '@operations/todo/ITodoController.ts';
import { IFavoriteControllerKey } from '@operations/favourites/IFavoriteController.ts';

const TodoListWidget = widget(() => {
  const todoController = useDependency(ITodoControllerKey.resolve);
  const favoriteController = useDependency(IFavoriteControllerKey.resolve);

  const list = useObservable(() => todoController.getTodoList$(), [], [todoController]);
  const deleteTodo = useAsyncEventHandler((id: string) => todoController.deleteTodo(id), [todoController]);
  const favorites = useObservable(() => favoriteController.getFavorites$(), [], [favoriteController]);

  return (
    <ul>
      {list.map((it) => (
        <li key={it.id}>
          {it.title} - {favorites.includes(it.id) ? 'Favorite' : 'Not favorite'}
          <Button type="button" onClick={() => deleteTodo(it.id)}>
            Delete
          </Button>
          <Button type="button" onClick={() => favoriteController.toggleFavorite(it.id)}>
            {favorites.includes(it.id) ? 'Remove from favorites' : 'Add to favourite'}
          </Button>
        </li>
      ))}
    </ul>
  );
}, 'TodoListWidget');

export default TodoListWidget;

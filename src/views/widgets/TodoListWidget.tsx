import { useObservable } from '@helpers/observable';
import { widget } from '@helpers/scope/components';
import Button from '@ui/button/Button';
import { useWidgetController } from '@framework/hooks/OnViewInit.ts';

class TodoListController {
  deleteTodo(id: string): void {}
}

const TodoListWidget = widget(() => {
  const controller = useWidgetController(TodoListController);

  const list = useObservable(() => todoController.getTodoList$(), [], [todoController]);
  const favorites = useObservable(() => favoriteController.getFavorites$(), [], [favoriteController]);

  return (
    <ul>
      {list.map((it) => (
        <li key={it.id}>
          {it.title} - {favorites.includes(it.id) ? 'Favorite' : 'Not favorite'}
          <Button type="button" onClick={() => controller.deleteTodo(it.id)}>
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

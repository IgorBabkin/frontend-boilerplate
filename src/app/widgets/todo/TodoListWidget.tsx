import { ITodoServiceKey } from './TodoService.ts';
import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import { widget } from '@lib/scope/ScopeHOCs.tsx';
import Button from '@ui/button/Button.tsx';
import { useAsyncEventHandler } from '@lib/scope/useQuery.ts';

const TodoListWidget = widget(() => {
  const todoService = useDependency(ITodoServiceKey.resolve);
  const list = useObservable(() => todoService.getTodoList$(), [], [todoService]);
  const deleteTodo = useAsyncEventHandler((id: string) => todoService.deleteTodo(id), [todoService]);

  return (
    <ul>
      {list.map((it) => (
        <li key={it.id}>
          {it.title}{' '}
          <Button type="button" onClick={() => deleteTodo(it.id)}>
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}, 'TodoListWidget');

export default TodoListWidget;

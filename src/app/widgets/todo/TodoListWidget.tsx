import { ITodoServiceKey, TodoService } from './TodoService.ts';
import { useService } from '../../../lib/scope/useQuery.ts';
import { useObservable } from '../../../lib/observable/observable.ts';
import { useMemo } from 'react';

function TodoListWidget() {
  const todoService = useService<TodoService>(ITodoServiceKey);
  const list = useObservable(
    useMemo(() => todoService.getTodoList$(), [todoService]),
    [],
  );

  return (
    <ul>
      {list.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
}

export default TodoListWidget;

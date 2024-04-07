import { ITodoServiceKey, TodoService } from './TodoService.ts';
import { useObservable } from '../../../lib/observable/observable.ts';
import { useMemo } from 'react';
import { useDependency } from '../../../lib/scope/ScopeContext.ts';

function TodoListWidget() {
  const todoService = useDependency<TodoService>(ITodoServiceKey);
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

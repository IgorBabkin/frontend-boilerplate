import { ITodoControllerKey, TodoController } from './TodoController.ts';
import { useController } from '../../../lib/scope/useQuery.ts';
import { useObservable } from '../../../lib/observable/observable.ts';
import { useMemo } from 'react';

function TodoListWidget() {
  const todoController = useController<TodoController>(ITodoControllerKey);
  const list = useObservable(
    useMemo(() => todoController.getTodoList$(), [todoController]),
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

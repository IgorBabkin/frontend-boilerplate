import { ITodoServiceKey } from './TodoService.ts';
import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import { widget } from '@lib/scope/ScopeHOCs.tsx';

const TodoListWidget = widget(() => {
  const todoService = useDependency(ITodoServiceKey.resolve);
  const list = useObservable(() => todoService.getTodoList$(), [], [todoService]);

  return (
    <ul>
      {list.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
}, 'TodoListWidget');

export default TodoListWidget;

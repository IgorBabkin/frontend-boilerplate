import { GetTodoList } from './operations/GetTodoList.ts';
import { useQuery } from '../../../lib/scope/useQuery.ts';

function TodoListWidget() {
  const list = useQuery(GetTodoList, undefined, []);

  return (
    <ul>
      {list.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
}

export default TodoListWidget;

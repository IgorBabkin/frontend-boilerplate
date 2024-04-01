import { GetTodoList } from './GetTodoList.ts';
import { useQuery } from '../../../lib/scope/useQuery.ts';

function TodoListWidget() {
  const list = useQuery(GetTodoList, []);

  return (
    <ul>
      {list.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}

export default TodoListWidget;

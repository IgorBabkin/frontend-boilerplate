import { GetTodoList } from './GetTodoList.ts';
import { useQuery } from '../../scope/useQuery.tsx';

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

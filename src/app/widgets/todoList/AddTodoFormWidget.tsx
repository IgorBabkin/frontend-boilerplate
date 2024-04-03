import { useCommand } from '../../../lib/scope/useQuery.ts';
import { AddTodo } from './operations/AddTodo.ts';
import { FormEvent, useCallback, useState } from 'react';

function AddTodoFormWidget() {
  const addTodo = useCommand(AddTodo);
  const [todo, setTodo] = useState('');
  const resetForm = useCallback(() => setTodo(''), []);

  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      addTodo(todo);
      resetForm();
    },
    [addTodo, resetForm, todo],
  );

  return (
    <form onSubmit={submit}>
      <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodoFormWidget;

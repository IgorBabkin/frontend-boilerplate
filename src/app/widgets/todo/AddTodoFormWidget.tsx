import { useCommand } from '../../../lib/scope/useQuery.ts';
import { AddTodo } from './operations/AddTodo.ts';
import { FormEvent, useCallback, useState } from 'react';
import Button from '../../ui/Button.tsx';
import TextField from '../../ui/TextField.tsx';

function AddTodoFormWidget() {
  const addTodo = useCommand(AddTodo);
  const [title, setTitle] = useState('');
  const resetForm = useCallback(() => setTitle(''), []);

  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      addTodo(title);
      resetForm();
    },
    [addTodo, resetForm, title],
  );

  return (
    <form onSubmit={submit}>
      <TextField value={title} onChange={setTitle} />
      <Button type="submit">Add</Button>
    </form>
  );
}

export default AddTodoFormWidget;

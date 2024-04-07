import { FormEvent, useCallback, useState } from 'react';
import Button from '../../ui/button/Button.tsx';
import TextField from '../../ui/textField/TextField.tsx';
import { useAsyncEventHandler } from '../../../lib/scope/useQuery.ts';
import { ITodoServiceKey, TodoService } from './TodoService.ts';
import { useDependency } from '../../../lib/scope/ScopeContext.ts';

function AddTodoFormWidget() {
  const todoService = useDependency<TodoService>(ITodoServiceKey);
  const [title, setTitle] = useState('');
  const resetForm = useCallback(() => setTitle(''), []);

  const submit = useAsyncEventHandler(
    async (e: FormEvent) => {
      e.preventDefault();
      await todoService.addTodo(title);
      resetForm();
    },
    [resetForm, title, todoService],
  );

  return (
    <form onSubmit={submit}>
      <TextField value={title} onChange={setTitle} />
      <Button type="submit">Add</Button>
    </form>
  );
}

export default AddTodoFormWidget;

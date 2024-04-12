import { FormEvent, useCallback, useState } from 'react';
import Button from '@ui/button/Button.tsx';
import TextField from '@ui/textField/TextField.tsx';
import { useAsyncEventHandler } from '@lib/scope/useQuery.ts';
import { ITodoServiceKey } from './TodoService.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import { widget } from '@lib/scope/ScopeHOCs.tsx';

const AddTodoFormWidget = widget(() => {
  const todoService = useDependency(ITodoServiceKey.resolve);
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
}, 'AddTodoFormWidget');

export default AddTodoFormWidget;

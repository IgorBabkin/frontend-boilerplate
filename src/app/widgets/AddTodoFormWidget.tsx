import { FormEvent, useCallback, useState } from 'react';
import Button from '@ui/button/Button';
import TextField from '@ui/textField/TextField';
import { useAsyncEventHandler } from '@framework/scope/useQuery';
import { ITodoServiceKey } from '@modules/todo/TodoService';
import { widget } from '@framework/scope/components';

import { useDependency } from '@framework/scope/ScopeContext';

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

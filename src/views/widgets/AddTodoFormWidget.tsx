import { FormEvent, useCallback, useState } from 'react';
import Button from '@ui/button/Button';
import TextField from '@ui/textField/TextField';
import { widget } from '@helpers/scope/components';

import { useAsyncEventHandler } from '@helpers/observable';
import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { ITodoControllerKey } from '@operations/todo/ITodoController.ts';

const AddTodoFormWidget = widget(() => {
  const todoController = useDependency(ITodoControllerKey.resolve);
  const [title, setTitle] = useState('');
  const resetForm = useCallback(() => setTitle(''), []);

  const submit = useAsyncEventHandler(
    async (e: FormEvent) => {
      e.preventDefault();
      await todoController.addTodo(title);
      resetForm();
    },
    [resetForm, title, todoController],
  );

  return (
    <form onSubmit={submit}>
      <TextField value={title} onChange={setTitle} />
      <Button type="submit">Add</Button>
    </form>
  );
}, 'AddTodoFormWidget');

export default AddTodoFormWidget;

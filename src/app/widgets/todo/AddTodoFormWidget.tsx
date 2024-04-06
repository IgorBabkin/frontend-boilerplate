import { useCommand } from '../../../lib/scope/useQuery.ts';
import { AddTodo } from './operations/AddTodo.ts';
import { FormEvent, useCallback, useState } from 'react';
import Button from '../../ui/button/Button.tsx';
import TextField from '../../ui/textField/TextField.tsx';
import { IErrorHandler, IErrorHandlerKey } from './IErrorHandler.tsx';
import { useDependency } from '../../../lib/scope/ScopeContext.ts';

function AddTodoFormWidget() {
  const addTodo = useCommand(AddTodo);
  const errorHandler = useDependency<IErrorHandler>(IErrorHandlerKey);
  const [title, setTitle] = useState('');
  const resetForm = useCallback(() => setTitle(''), []);

  const submit = useCallback(
    (e: FormEvent) => {
      errorHandler.handle(async () => {
        e.preventDefault();
        await addTodo(title);
        resetForm();
      });
    },
    [addTodo, errorHandler, resetForm, title],
  );

  return (
    <form onSubmit={submit}>
      <TextField value={title} onChange={setTitle} />
      <Button type="submit">Add</Button>
    </form>
  );
}

export default AddTodoFormWidget;

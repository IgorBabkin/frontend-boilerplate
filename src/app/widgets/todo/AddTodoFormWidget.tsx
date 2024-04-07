import { FormEvent, useCallback, useState } from 'react';
import Button from '../../ui/button/Button.tsx';
import TextField from '../../ui/textField/TextField.tsx';
import { IErrorHandler, IErrorHandlerKey } from '../../domain/errors/IErrorHandler.ts';
import { useDependency } from '../../../lib/scope/ScopeContext.ts';
import { useService } from '../../../lib/scope/useQuery.ts';
import { ITodoServiceKey, TodoService } from './TodoService.ts';

function AddTodoFormWidget() {
  const todoService = useService<TodoService>(ITodoServiceKey);
  const errorHandler = useDependency<IErrorHandler>(IErrorHandlerKey);
  const [title, setTitle] = useState('');
  const resetForm = useCallback(() => setTitle(''), []);

  const submit = useCallback(
    (e: FormEvent) => {
      errorHandler.handle(async () => {
        e.preventDefault();
        await todoService.addTodo(title);
        resetForm();
      });
    },
    [errorHandler, resetForm, title, todoService],
  );

  return (
    <form onSubmit={submit}>
      <TextField value={title} onChange={setTitle} />
      <Button type="submit">Add</Button>
    </form>
  );
}

export default AddTodoFormWidget;

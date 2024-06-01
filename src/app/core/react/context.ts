import { useContext, Context } from 'react';
import { ContextNotFoundError } from './ContextNotFoundError';

export const useContextOrFail = <T>(Context: Context<T>) => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new ContextNotFoundError('Scope is not defined');
  }
  return context;
};

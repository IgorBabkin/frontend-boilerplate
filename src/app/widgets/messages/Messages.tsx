import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import { IMessageServiceKey } from './MessageService.ts';

function Messages() {
  const messageService = useDependency(IMessageServiceKey.resolve);
  const message = useObservable(() => messageService.getMessage$(), undefined, [messageService]);
  return <div>{message}</div>;
}

export default Messages;

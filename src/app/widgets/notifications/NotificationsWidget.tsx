import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import { INotificationServiceKey } from './NotificationService.ts';

function NotificationsWidget() {
  const messageService = useDependency(INotificationServiceKey.resolve);
  const message = useObservable(() => messageService.getMessage$(), undefined, [messageService]);
  return <div>{message}</div>;
}

export default NotificationsWidget;

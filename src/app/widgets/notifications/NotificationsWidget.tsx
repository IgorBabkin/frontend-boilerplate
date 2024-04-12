import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import { INotificationServiceKey } from './NotificationService.ts';
import { widget } from '@lib/scope/ScopeHOCs.tsx';

const NotificationsWidget = widget(() => {
  const messageService = useDependency(INotificationServiceKey.resolve);
  const message = useObservable(() => messageService.getMessage$(), undefined, [messageService]);
  return <div>{message}</div>;
}, 'NotificationsWidget');

export default NotificationsWidget;

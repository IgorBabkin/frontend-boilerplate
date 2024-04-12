import { useObservable } from '@lib/observable/observable.ts';
import { useDependency } from '@lib/scope/ScopeContext.ts';
import { INotificationServiceKey } from './NotificationService.ts';
import { ScopeProps, withScope } from '@lib/scope/ScopeHOCs.tsx';

const NotificationsWidget = withScope(() => {
  const messageService = useDependency(INotificationServiceKey.resolve);
  const message = useObservable(() => messageService.getMessage$(), undefined, [messageService]);
  return <div>{message}</div>;
}, ScopeProps.widget('NotificationsWidget'));

export default NotificationsWidget;

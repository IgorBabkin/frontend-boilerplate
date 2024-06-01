import { useObservable } from '@core/observable/observable';
import { INotificationServiceKey } from '@modules/notifications/NotificationService';
import { widget } from '@framework/scope/components';

import { useDependency } from '@framework/scope/ScopeContext';

const NotificationsWidget = widget(() => {
  const messageService = useDependency(INotificationServiceKey.resolve);
  const message = useObservable(() => messageService.getMessage$(), undefined, [messageService]);
  return <div>{message}</div>;
}, 'NotificationsWidget');

export default NotificationsWidget;

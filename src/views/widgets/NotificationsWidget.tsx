import { useObservable } from '@helpers/observable';
import { widget } from '@helpers/scope/components';

import { useDependency } from '@helpers/scope/ScopeContext';
import { INotificationServiceKey } from '@modules/notifications/INotificationService.public';

const NotificationsWidget = widget(() => {
  const messageService = useDependency(INotificationServiceKey.resolve);
  const message = useObservable(() => messageService.getMessage$(), undefined, [messageService]);
  return <div>{message}</div>;
}, 'NotificationsWidget');

export default NotificationsWidget;

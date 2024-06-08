import { useObservable } from '@helpers/observable';
import { widget } from '@helpers/scope/components';

import { useDependency } from '@helpers/scope/ScopeContext';
import { INotificationControllerKey } from '@operations/INotificationController.ts';

const NotificationsWidget = widget(() => {
  const notificationController = useDependency(INotificationControllerKey.resolve);
  const message = useObservable(() => notificationController.getMessage$(), undefined, [notificationController]);
  return <div>{message}</div>;
}, 'NotificationsWidget');

export default NotificationsWidget;

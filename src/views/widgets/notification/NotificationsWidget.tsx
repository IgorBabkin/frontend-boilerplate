import { widget } from '@helpers/scope/components.tsx';

import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { INotificationControllerKey } from '@operations/notifications/INotificationController.ts';
import { useCallback } from 'react';
import { Toast } from '@ui/toast/Toast.tsx';
import './notificationWidget.scss';
import { useObs$ } from '@helpers/observable.ts';

const NotificationsWidget = widget(() => {
  const controller = useDependency(INotificationControllerKey.resolve);
  const notifications = useObs$(controller.notifications$, []);
  const deleteMessage = useCallback((id: string) => () => controller.deleteMessage(id), [controller]);

  return (
    <ul className="toast-list">
      {notifications.map((m) => (
        <li key={m.id} className="toast-list__item">
          <Toast title={m.title} type={m.type} onClose={deleteMessage(m.id)}>
            {m.body}
          </Toast>
        </li>
      ))}
    </ul>
  );
}, 'NotificationsWidget');

export default NotificationsWidget;

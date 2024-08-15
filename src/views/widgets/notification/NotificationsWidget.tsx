import { widget } from '@helpers/scope/components.tsx';

import { useDependency } from '@helpers/scope/ScopeContext.ts';
import { INotificationControllerKey } from '@operations/notifications/INotificationController.ts';
import { useCallback } from 'react';
import { useArrayState } from '@lib/observable/hooks.ts';
import { Toast } from '@ui/toast/Toast.tsx';
import './notificationWidget.scss';
import { Entity } from '@lib/types.ts';
import { generateID } from '@lib/utils.ts';

const mapToArray =
  <T,>(value: T) =>
  (prev: Entity<T>[]): Entity<T>[] => [...prev, { ...value, id: generateID() }];

const NotificationsWidget = widget(() => {
  const controller = useDependency(INotificationControllerKey.resolve);
  const [notifications, setNotifications] = useArrayState(controller.message$, { mapFn: mapToArray });
  const removeNotifications = useCallback(
    (id: string) => () => setNotifications((prevState) => prevState.filter((v) => v.id !== id)),
    [setNotifications],
  );

  return (
    <ul className="toast-list">
      {notifications.map((m) => (
        <li key={m.id} className="toast-list__item">
          <Toast title={m.title} type={m.type} onClose={removeNotifications(m.id)}>
            {m.body}
          </Toast>
        </li>
      ))}
    </ul>
  );
}, 'NotificationsWidget');

export default NotificationsWidget;

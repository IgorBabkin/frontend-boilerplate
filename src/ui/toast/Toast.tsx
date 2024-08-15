import { NotificationType } from '@operations/notifications/INotificationController.ts';
import cs from 'classnames';

export const Toast = ({
  children,
  type,
  title,
  onClose,
}: {
  children: string;
  type: NotificationType;
  title: string;
  onClose: () => void;
}) => {
  return (
    <div className={cs('toast', type)}>
      <h3>{title}</h3>
      <p>{children}</p>
      <button type="button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

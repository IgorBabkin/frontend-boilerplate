import cs from 'classnames';
import { NotificationType } from '@operations/notifications/NotificationController.ts';

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

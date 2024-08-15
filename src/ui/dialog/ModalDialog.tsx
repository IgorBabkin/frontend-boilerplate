import { PropsWithChildren } from 'react';

export const ModalDialog = ({
  title,
  children,
  onClose,
}: PropsWithChildren<{ title: string; onClose: () => void }>) => {
  return (
    <div className="modal">
      <button type="button" className="modal__close" onClick={onClose}>
        &times;
      </button>
      <div className="modal__content">
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  );
};

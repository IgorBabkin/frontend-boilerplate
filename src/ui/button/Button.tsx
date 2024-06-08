import { PropsWithChildren } from 'react';

interface ButtonProps {
  type: 'submit' | 'button';
  onClick?: () => void;
}

function Button({ children, type, onClick }: PropsWithChildren<ButtonProps>) {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;

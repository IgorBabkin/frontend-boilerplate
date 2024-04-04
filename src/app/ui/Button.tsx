import { PropsWithChildren } from 'react';

interface ButtonProps {
  type: 'submit';
}

function Button({ children, type }: PropsWithChildren<ButtonProps>) {
  return <button type={type}>{children}</button>;
}

export default Button;

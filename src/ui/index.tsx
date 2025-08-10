import ButtonComponent from './button/Button.tsx';
import { withTryCatchOnClick } from '@widgets/TryWithCatch.tsx';

export const Button = withTryCatchOnClick(ButtonComponent);

import { useEffect } from 'react';

export const useOnPageLeave = (handler: () => void) => {
  useEffect(() => {
    window.onbeforeunload = () => handler();

    window.addEventListener('beforeunload', () => {
      handler();
    });

    return () => {
      handler();
      document.removeEventListener('beforeunload', handler);
    };
  });
};

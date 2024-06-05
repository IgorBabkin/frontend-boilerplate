import { useEffect } from 'react';

export const useOnPageLeave = (handler: () => void, deps: unknown[] = []) => {
  useEffect(() => {
    window.onbeforeunload = () => handler();

    window.addEventListener('beforeunload', () => {
      handler();
    });

    return () => {
      handler();
      window.removeEventListener('beforeunload', handler);
    };
  }, deps);
};

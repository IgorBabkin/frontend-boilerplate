import { useEffect } from 'react';
import { TimeoutID } from '@lib/types.ts';
import { useErrorHandler } from '@helpers/observable.ts';

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

export const useIdleTimer = (handler: () => void, timeout: number, deps: unknown[] = []) => {
  const handleError = useErrorHandler();
  const fn = handleError(handler);
  useEffect(() => {
    let timer: TimeoutID;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(fn, timeout);
    };

    resetTimer();

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, deps);
};

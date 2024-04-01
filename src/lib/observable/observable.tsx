import { Observable } from 'rxjs';
import { useEffect, useState } from 'react';

export const useObservable = <T,>(obs$: Observable<T>, initial: T, onError: (err: Error) => void): T => {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const sub = obs$.subscribe({ next: setValue, error: onError });
    return () => sub.unsubscribe();
  }, [obs$, onError]);
  return value;
};

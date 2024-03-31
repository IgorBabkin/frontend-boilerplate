import { Observable } from 'rxjs';
import { useEffect, useState } from 'react';

export const useObservable = <T,>(obs$: Observable<T>, initial: T): T => {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    const sub = obs$.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [obs$]);
  return value;
};

import { Subscribable } from 'rxjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useObs$ } from '@helpers/observable.ts';

export const useArrayState = <T, V>(
  obs$: Subscribable<T>,
  { mapFn }: { mapFn: (value: T) => (prev: V[]) => V[] },
): [V[], Dispatch<SetStateAction<V[]>>] => {
  const [messages, setMessages] = useState<V[]>([]);
  const current = useObs$(obs$, undefined);

  useEffect(() => {
    if (current) {
      setMessages(mapFn(current));
    }
  }, [current, mapFn]);

  return [messages, setMessages];
};

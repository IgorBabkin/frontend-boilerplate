import { Observable, Subject } from 'rxjs';
import { addItemToList, Metadata } from '@framework/hooks/Metadata.ts';
import { Unsubscribe } from '@framework/hooks/OnInit.ts';
import { WatchMessage } from '@lib/watch/watchMessage.ts';

type Watchable = {
  key: string;
};

const getProperty = (target: object, propertyKey: string | symbol): unknown => {
  // eslint-disable-next-line
  // @ts-ignore
  return target[propertyKey] as object;
};

const sendWatchMessage = (message: WatchMessage) => {
  window.postMessage({ type: 'WATCH_REQUEST', message }, '*');
};

const isWatchResponse = (event: MessageEvent): boolean => {
  return event.data.type === 'WATCH_RESPONSE';
};

export const disposeMetadata = new Metadata<Map<string, Unsubscribe[]>>('__dispose__', () => new Map());

export function unwatch(instance: object) {
  (disposeMetadata.getMetadata(instance) ?? new Map()).forEach((fn) => fn());
  disposeMetadata.delete(instance);
}

const watchProxy = (target: Watchable) => {
  const watching = getWatching(target);
  return new Proxy(target, {
    get(target, prop) {
      if (typeof prop === 'string' && prop in target) {
        if (watching.includes(prop) && !disposeMetadata.has(target)) {
          subscribeToProperty(target, prop as string);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return target[prop];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return target[prop];
    },
  });
};

export const watch: PropertyDecorator = (target: object, propertyKey: string | symbol) => {
  Reflect.defineMetadata('watch', [...getWatching(target), propertyKey], target.constructor);
};

export const getWatching = (instance: object): string[] => {
  return Reflect.getOwnMetadata('watch', instance.constructor) ?? [];
};

export const subscribeToProperty = (target: Watchable, propertyKey: string) => {
  const prop = getProperty(target, propertyKey);
  const addSubscription = (fn: Unsubscribe) =>
    disposeMetadata.setMetadata(target, (prev) => {
      prev.set(propertyKey, addItemToList(fn)(prev.get(propertyKey) ?? []));
      return prev;
    });

  if (prop instanceof Subject) {
    const cb = (event: MessageEvent) => {
      if (isWatchResponse(event)) {
        const message = event.data.message as WatchMessage;

        if (message.groupName === target.key && message.targetKey === propertyKey) {
          prop.next(message.value);
        }
      }
    };
    window.addEventListener('message', cb);

    addSubscription(() => window.removeEventListener('message', cb));
  }

  if (prop instanceof Observable) {
    const s = prop.subscribe((value) => {
      sendWatchMessage({ groupName: target.constructor.name, targetKey: target.key, value });
    });

    addSubscription(() => s.unsubscribe());
  }
};

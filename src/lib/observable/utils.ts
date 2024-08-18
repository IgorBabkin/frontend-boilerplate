import { Observable } from 'rxjs';
import { isRef, Ref, ref } from 'vue';

export const toObs$ = (arg: unknown) => {
  if (arg instanceof Observable) {
    return arg;
  }

  if (arg instanceof Promise) {
    return new Observable((s) => {
      arg
        .then((r) => {
          s.next(r);
          s.complete();
        })
        .catch((e) => s.error(e));
    });
  }

  return new Observable((s) => {
    s.next(arg);
    s.complete();
  });
};

export const toRef = (arg: unknown): Ref<unknown> => {
  if (isRef(arg)) {
    return arg;
  }

  if (arg instanceof Promise) {
    const result = ref(undefined);
    arg.then((r) => {
      result.value = r;
    });

    return result;
  }

  return ref(arg);
};

// @ts-expect-error
export const skipWhileBusy: MethodDecorator = (target, propertyKey, descriptor) => {
  const originalMethod = descriptor.value as () => Promise<void> | void;
  let isBusy = false;
  let result: unknown | undefined = undefined;
  // @ts-expect-error
  descriptor.value = async function (...args: unknown[]) {
    if (isBusy) {
      return result;
    }
    isBusy = true;
    try {
      // @ts-expect-error
      result = await originalMethod.apply(this, args);
      return result;
    } finally {
      isBusy = false;
    }
  };
  return descriptor;
};

export const debounceAsync =
  (delay: number): MethodDecorator =>
  // @ts-expect-error
  (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value as () => Promise<unknown>;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let result: unknown | undefined = undefined;
    // @ts-expect-error
    descriptor.value = function (...args: unknown[]) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        originalMethod
          // @ts-expect-error
          .apply(this, args)
          .then((r) => {
            result = r;
          })
          .finally(() => {
            timer = undefined;
          });
      }, delay);
      return result;
    };
    return descriptor;
  };

export const throttleAsync =
  (delay: number): MethodDecorator =>
  // @ts-expect-error
  (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value as () => Promise<unknown>;
    let lastTime = 0;
    let result: unknown | undefined = undefined;
    // @ts-expect-error
    descriptor.value = async function (...args: unknown[]) {
      const now = Date.now();
      if (now - lastTime < delay) {
        return result;
      }
      lastTime = now;
      try {
        // @ts-expect-error
        result = await originalMethod.apply(this, args);
        return result;
      } finally {
        lastTime = 0;
      }
    };
    return;
  };

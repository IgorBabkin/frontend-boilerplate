import { Unsubscribe } from '@framework/hooks/OnViewInit.ts';

export interface Initializable {
  init(): void | Unsubscribe;
}

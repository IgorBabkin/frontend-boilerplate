import { Unsubscribe } from '@framework/hooks/OnInit.ts';

export interface Initializable {
  init(): void | Unsubscribe;
}

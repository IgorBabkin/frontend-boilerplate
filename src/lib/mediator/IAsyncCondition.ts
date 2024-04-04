import { constructor, getMetadata, setMetadata } from 'ts-ioc-container';
import { IAsyncCommand } from './ICommand.ts';

export interface IAsyncCondition {
  isTrue(): Promise<boolean>;
}

export const when = (Condition: constructor<IAsyncCondition>) => setMetadata('condition', Condition);
export const getCondition = (condition: IAsyncCommand<unknown>) =>
  getMetadata<constructor<IAsyncCondition>>(condition.constructor, 'condition');

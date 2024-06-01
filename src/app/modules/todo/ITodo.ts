import { IEntity } from '@core/observable/IEntity';

export interface ITodo extends IEntity {
  title: string;
}

export interface ITodoFilter {
  status: 'active' | 'completed';
}

import { Observable } from 'rxjs';

export interface IQuery<Response> {
  execute(): Observable<Response>;
}

import { Observable } from 'rxjs';

type Fn<P, R> = (payload: P) => R;
export type CommandMethod<Payload = never> = Fn<Payload, Promise<void> | void>;
export type QueryMethod<Payload = never, Response = unknown> = Fn<Payload, Observable<Response>>;

export type CommandMethodKeys<T extends object, Method> = {
  [K in keyof T]: T[K] extends Method ? K : never;
}[keyof T];

export type Payload<Target extends object, Method extends keyof Target> =
  Target[Method] extends Fn<infer R, unknown> ? R : never;

export type Response<Target extends object, Method extends keyof Target> =
  Target[Method] extends Fn<unknown, Observable<infer R>> ? R : never;

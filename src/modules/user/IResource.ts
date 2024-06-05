export interface IResource {
  resource: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isResource(value: any): value is IResource {
  return value && typeof value.resource === 'string';
}

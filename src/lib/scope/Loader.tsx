import { PropsWithChildren } from 'react';
import { useQuery } from './useQuery.ts';
import { IsScopeVisible } from './IsScopeVisible.ts';

export function Loader({ children }: PropsWithChildren) {
  const isVisible = useQuery(IsScopeVisible, undefined, true);
  return <div>{isVisible ? children : <div>Loading...</div>}</div>;
}

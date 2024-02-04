import { AsyncLocalStorage } from 'node:async_hooks';

export const createContext = <T>() => {
  const context = new AsyncLocalStorage<T>();
  return context;
};

export type AsyncContext<T> = AsyncLocalStorage<T>;

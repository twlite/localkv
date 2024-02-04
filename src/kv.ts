import { AsyncContext, createContext } from './common';

export const enum KVStoreMode {
  /**
   * This enables asynchronous mode when async context is available, falling back to synchronous mode when necessary. Default mode is SynchronousFallback.
   */
  SynchronousFallback,
  /**
   * This enables asynchronous storage mode for all KV operations. An error will be thrown if async context is not available.
   */
  Asynchronous,
}

export interface KVInit {
  storeMode?: KVStoreMode;
}

export class KV<K = any, V = any> {
  #context: AsyncContext<Map<K, V>>;

  /**
   * Create a new KV instance. KV is a simple key-value store that can be used to store/access temporary data within its context.
   * @param options The options to use.
   */
  public constructor(private options: KVInit = {}) {
    options.storeMode ??= KVStoreMode.SynchronousFallback;
    this.#context = createContext();
  }

  /**
   * Configure the KV instance.
   * @param options The options to use.
   */
  public configure(options: KVInit) {
    this.options = options;
  }

  /**
   * Run a callback with new async context. The context will be automatically exited after the callback is done.
   * @param cb The callback to run.
   */
  public with(cb: () => void) {
    const store = new Map<K, V>();
    this.#context.run(store, cb);
  }

  /**
   * Get the size of the store. This will throw an error if called outside of a context.
   */
  public get size() {
    return this.#ctx().size;
  }

  /**
   * Check if the given key exists in the store. This will throw an error if called outside of a context.
   * @param key The key to check.
   */
  public has(key: K): boolean {
    return this.#ctx().has(key);
  }

  /**
   * Get the value of the given key. This will throw an error if called outside of a context.
   * @param key The key to get.
   */
  public get(key: K): V | undefined {
    return this.#ctx().get(key);
  }

  /**
   * Set the value of the given key. This will throw an error if called outside of a context.
   * @param key The key to set.
   * @param value The value to set.
   */
  public set(key: K, value: V): void {
    const mode = this.#mode;

    const ctx = this.#ctx(mode !== KVStoreMode.Asynchronous);

    if (!ctx && mode === KVStoreMode.SynchronousFallback)
      return void this.#context.enterWith(new Map([[key, value]]));

    ctx!.set(key, value);
  }

  /**
   * Delete the value of the given key. This will throw an error if called outside of a context.
   * @param key The key to delete.
   * @returns Whether the key was deleted or not.
   */
  public delete(key: K): boolean {
    return this.#ctx().delete(key);
  }

  /**
   * Clear the store. This will throw an error if called outside of a context.
   */
  public clear(): void {
    this.#ctx().clear();
  }

  /**
   * Disable current context until new value is set (if synchronous mode is enabled) or new context is created.
   */
  public disable() {
    this.#context.disable();
  }

  /**
   * Exit the context.
   * @param callback The callback to run after the context is exited.
   */
  public exit(callback: () => unknown) {
    this.#context.exit(callback);
  }

  /**
   * Iterate over the store. This will throw an error if called outside of a context.
   */
  public *[Symbol.iterator]() {
    yield* this.#ctx();
  }

  get #mode() {
    return this.options.storeMode ?? KVStoreMode.SynchronousFallback;
  }

  #ctx(suppress?: false): Map<K, V>;
  #ctx(suppress: true): Map<K, V> | undefined;
  #ctx(suppress?: boolean): Map<K, V> | undefined;
  #ctx(suppress = false): Map<K, V> | undefined {
    const ctx = this.#context.getStore();

    if (!ctx && !suppress) {
      throw new Error(
        'KV operations must be performed within a context. Did you forget to call kv.with()?'
      );
    }

    return ctx;
  }
}

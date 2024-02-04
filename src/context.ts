import { createContext } from './common';

/**
 * Simple context manager.
 */
export class Context<V> {
  #context = createContext<V>();

  /**
   * Set the value of the context synchronously.
   * @param value The value to set.
   */
  public set(value: V) {
    if (value === undefined)
      throw new TypeError('Context data may not be undefined');

    this.#context.enterWith(value);
  }

  /**
   * Run a callback with new async context. The context will be automatically exited after the callback is done.
   * @param data The data to set in this context.
   * @param cb The callback to run.
   */
  public with(data: V, cb: () => unknown) {
    this.#context.run(data, cb);
  }

  /**
   * Get the value of the context. This will throw an error if called outside of a context.
   */
  public get(): V | undefined {
    const data = this.#context.getStore();
    if (data === undefined) {
      throw new Error('Context#get must be called within a context');
    }

    return data;
  }

  /**
   * Exit the context.
   * @param callback The callback to run after the context is exited.
   */
  public exit(callback: () => unknown) {
    this.#context.exit(callback);
  }

  /**
   * Disable the context.
   */
  public disable() {
    this.#context.disable();
  }
}

import { describe, expect, test } from 'bun:test';
import { Context } from '../src/context';

describe('context', () => {
  test('should be able to create context', () => {
    expect(new Context()).toBeInstanceOf(Context);
  });

  test('should be able to set and get value', () => {
    const context = new Context();

    context.set('value');

    expect(context.get()).toBe('value');
  });

  test('should be able to run with new context', () => {
    const context = new Context();
    context.set('example');

    context.with('value', () => {
      expect(context.get()).toBe('value');
    });

    // The context should be back to the original value since we are out of the async context created by `with`
    expect(context.get()).toBe('example');
  });

  test('should be able to exit context', () => {
    const context = new Context();

    context.set('value');
    expect(context.get()).toBe('value');

    context.exit(() => {
      // This will throw an error since the context is exited inside this scope
      expect(() => context.get()).toThrow();
    });

    // The context should not be lost here since we are out of the exit scope
    expect(context.get()).toBe('value');
  });

  test('should be able to disable context', () => {
    const context = new Context();

    context.set('value');
    expect(context.get()).toBe('value');

    // The context is disabled globally until new value is set
    context.disable();

    // This will throw an error since the context is disabled
    expect(() => context.get()).toThrow();

    context.set('new-value');

    // The context is back to normal
    expect(context.get()).toBe('new-value');
  });
});

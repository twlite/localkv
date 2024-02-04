import { describe, test, expect } from 'bun:test';
import { KV, KVStoreMode } from '../src/kv';

describe('KV', () => {
  const kv = new KV<string, string>();

  test('should set and get value', () => {
    kv.set('key', 'value');
    kv.set('abc', 'def');

    expect(kv.get('key')).toBe('value');
    expect(kv.get('abc')).toBe('def');
    expect(kv.size).toBe(2);
  });

  test('should exit context when needed', () => {
    kv.set('foo', 'bar');
    expect(kv.get('foo')).toBe('bar');
    kv.exit(() => {
      expect(() => kv.get('foo')).toThrow();
    });
    expect(kv.get('foo')).toBe('bar');
  });

  test('should disable context', () => {
    kv.disable();
    expect(() => kv.get('key')).toThrow();
  });

  test('should create async context', () => {
    kv.set('key', 'value');

    // create async context
    kv.with(() => {
      // set value for within async context
      kv.set('async-key', 'async-value');

      // should be able to access async context data
      expect(kv.get('async-key')).toBe('async-value');

      // should not be able to access synchronous context data since it is overridden by async context
      expect(kv.get('key')).toBeUndefined();
    });

    // async context data should not exist anymore and we should be on synchronous context now
    expect(kv.get('async-key')).toBeUndefined();

    // synchronous context data should exist
    expect(kv.get('key')).toBe('value');
  });

  test('should be able to nest new kv instances', () => {
    kv.with(() => {
      kv.set('key', 'value');

      const nestedKV = new KV();

      nestedKV.with(() => {
        nestedKV.set('nested-key', 'nested-value');
        expect(nestedKV.get('nested-key')).toBe('nested-value');
        expect(kv.get('key')).toBe('value');
      });
    });
  });

  test('should throw error trying to set data in asynchronous mode without creating context', () => {
    // clear previous context
    kv.disable();

    // set asynchronous mode
    kv.configure({ storeMode: KVStoreMode.Asynchronous });

    // should throw error since we are not in a context anymore
    expect(() => kv.set('key', 'value')).toThrow();

    // should not throw error since we are in a context
    kv.with(() => {
      expect(() => kv.set('key', 'value')).not.toThrow();
    });
  });
});

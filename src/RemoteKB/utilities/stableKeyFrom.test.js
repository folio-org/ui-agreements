import stableKeyFrom from './stableKeyFrom';

describe('stableKeyFrom', () => {
  test('returns a string starting with "k" and base36 chars', () => {
    const key = stableKeyFrom('abc');
    expect(typeof key).toBe('string');
    expect(key).toMatch(/^k[a-z0-9]+$/);
  });

  test('is deterministic for the same primitive input', () => {
    const k1 = stableKeyFrom('hello');
    const k2 = stableKeyFrom('hello');
    expect(k1).toBe(k2);
  });

  test('produces different keys for slightly different primitive inputs', () => {
    const a = stableKeyFrom('abc');
    const b = stableKeyFrom('abcd');
    expect(a).not.toBe(b);
  });

  test('handles numbers, booleans, null, and undefined', () => {
    expect(stableKeyFrom(42)).toMatch(/^k[a-z0-9]+$/);
    expect(stableKeyFrom(true)).toMatch(/^k[a-z0-9]+$/);
    expect(stableKeyFrom(null)).toMatch(/^k[a-z0-9]+$/);
    expect(stableKeyFrom(undefined)).toMatch(/^k[a-z0-9]+$/);
  });

  test('is deterministic for equal plain objects with same insertion order', () => {
    const obj = { a: 1, b: 2 };
    const clone = JSON.parse(JSON.stringify(obj)); // preserves order
    expect(stableKeyFrom(obj)).toBe(stableKeyFrom(clone));
  });

  test('different insertion order produces different keys (documenting behavior)', () => {
    const o1 = { a: 1, b: 2 };
    const o2 = { b: 2, a: 1 }; // JSON.stringify order differs
    expect(stableKeyFrom(o1)).not.toBe(stableKeyFrom(o2));
  });

  test('arrays are order-sensitive', () => {
    const k1 = stableKeyFrom([1, 2, 3]);
    const k2 = stableKeyFrom([3, 2, 1]);
    expect(k1).not.toBe(k2);
  });
});

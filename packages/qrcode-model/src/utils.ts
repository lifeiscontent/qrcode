import type { int, bit } from './types';

export function appendBits(val: int, len: int, bb: bit[]): void {
  if (len < 0 || len > 31 || val >>> len != 0) {
    throw new RangeError('Value out of range');
  }

  for (
    let i = len - 1;
    i >= 0;
    i-- // Append bit by bit
  ) {
    bb.push((val >>> i) & 1);
  }
}

// Returns true iff the i'th bit of x is set to 1.
export function getBit(x: int, i: int): boolean {
  return ((x >>> i) & 1) != 0;
}

// Throws an exception if the given condition is false.
export function assert(cond: boolean, message = 'Assertion error'): void {
  if (!cond) throw new Error(message);
}

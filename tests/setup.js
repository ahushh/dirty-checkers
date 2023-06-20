import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

expect.extend({
  toHaveSameElements(received, expected) {
    const { isNot } = this
    return {
      pass: received.length === expected.length && received.map(a => JSON.stringify(a)).every(item => expected.map(b => JSON.stringify(b)).includes(item)),
      message: () => `${received} is${isNot ? ' not' : ''} foo`
    }
  }
})

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
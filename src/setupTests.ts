// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

/**
 * Utility function that mocks the `IntersectionObserver` API. Necessary for components that rely
 * on it, otherwise the tests will crash. Recommended to execute inside `beforeEach`.
 * @param intersectionObserverMock - Parameter that is sent to the `Object.defineProperty`
 * overwrite method. `jest.fn()` mock functions can be passed here if the goal is to not only
 * mock the intersection observer, but its methods.
 */
export function setupIntersectionObserverMock({
  root = null,
  rootMargin = '',
  thresholds = [],
  disconnect = () => null,
  observe = () => null,
  takeRecords = () => [],
  unobserve = () => null,
} = {}): void {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = root;
    readonly rootMargin: string = rootMargin;
    readonly thresholds: ReadonlyArray<number> = thresholds;
    disconnect: () => void = disconnect;
    observe: (target: Element) => void = observe;
    takeRecords: () => IntersectionObserverEntry[] = takeRecords;
    unobserve: (target: Element) => void = unobserve;
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

setupIntersectionObserverMock();

/**
 * toBeSymbol
 */

// eslint-disable-next-line node/no-unpublished-import
import {expect} from '@jest/globals';
// eslint-disable-next-line node/no-unpublished-import
import type {MatcherFunction} from 'expect';
const toBeSymbol: MatcherFunction<[]> =
  // `floor` and `ceiling` get types from the line above
  // it is recommended to type them as `unknown` and to validate the values
  function (actual) {
    const pass = typeof actual === 'symbol';
    if (pass) {
      return {
        message: () =>
          // `this` context will have correct typings
          `expected ${this.utils.printReceived(
            actual
          )} not to be type of ${this.utils.printExpected('symbol')}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            actual
          )} to be type of ${this.utils.printExpected('symbol')}`,
        pass: false,
      };
    }
  };

expect.extend({
  toBeSymbol,
});

declare module 'expect' {
  interface AsymmetricMatchers {
    toBeSymbol(): void;
  }
  interface Matchers<R> {
    toBeSymbol(): R;
  }
}

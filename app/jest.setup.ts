// Jest setup for app
import '@testing-library/jest-dom';

// window.matchMedia mock for components relying on it
(() => {
  const createMatchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList);

  if (!('matchMedia' in window) || typeof window.matchMedia !== 'function') {
    (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = createMatchMedia;
  }
})();

// next/navigation minimal mocks (for app router)
jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

// Common DOM mocks
if (!window.scrollTo) {
  Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });
}

if (!(window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
    root: Element | null = null;
    rootMargin = '';
    thresholds: number[] = [];
  }
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO as unknown as typeof IntersectionObserver;
}

// Silence React act warnings in unrelated async code paths
const originalError: (...args: unknown[]) => void = console.error as unknown as (...args: unknown[]) => void;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (/Warning: An update to .* inside a test was not wrapped in act/.test(args[0]) ||
      /Warning: useLayoutEffect does nothing on the server/.test(args[0]))
  ) {
    return;
  }
  originalError(...(args as unknown as []));
};

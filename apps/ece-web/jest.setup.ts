// Jest setup for ece-web
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

// Silence React act warnings in unrelated async code paths
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (/Warning: An update to .* inside a test was not wrapped in act/.test(args[0]) ||
      /Warning: useLayoutEffect does nothing on the server/.test(args[0]))
  ) {
    return;
  }
  // @ts-ignore - preserve console signature
  originalError(...args);
};

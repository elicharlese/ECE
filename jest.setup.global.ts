// Global Jest setup for UI test stabilization across the monorepo
import '@testing-library/jest-dom';

// matchMedia
if (typeof window !== 'undefined') {
  (() => {
    const createMatchMedia = (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList);

    if (!('matchMedia' in window) || typeof window.matchMedia !== 'function') {
      (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = createMatchMedia;
    }
  })();
}

// Vitest compatibility shim
(globalThis as unknown as { vi?: { fn: typeof jest.fn; spyOn: typeof jest.spyOn } }).vi = {
  fn: jest.fn,
  spyOn: jest.spyOn,
};

// Common DOM mocks
if (typeof window !== 'undefined') {
  if (!window.scrollTo) {
    // @ts-expect-error add missing scrollTo for jsdom
    window.scrollTo = () => {};
  }
}

if (typeof window !== 'undefined') {
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
}

import 'tests/test-i18n'; // ✅ Load actual translations
import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
});

if (!window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };
}

// vitest.setup.ts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

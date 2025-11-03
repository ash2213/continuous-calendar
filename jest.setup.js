// jest.setup.js
import '@testing-library/jest-dom';

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock matchMedia
window.matchMedia = jest.fn(() => ({
  matches: false,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

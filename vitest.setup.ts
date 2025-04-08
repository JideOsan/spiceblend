import { server } from './src/mocks/server';
import '@testing-library/jest-dom/vitest';

vi.mock('react-virtualized-auto-sizer', () => ({
  __esModule: true,
  default: ({
    children,
  }: {
    children: (props: { height: number; width: number }) => unknown;
  }) => children({ height: 600, width: 800 }),
}));

// Set timezone to UTC to avoid timezone issues in tests
process.env.TZ = 'UTC';

beforeAll(() => {
  // 👀 Enable the mocking in tests.
  server.listen();
});

afterEach(() => {
  // 🔁 Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // 🚿 Clean up once the tests are done.
  server.close();
});

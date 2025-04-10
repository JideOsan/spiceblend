import { server } from './src/mocks/server';
import '@testing-library/jest-dom/vitest';
import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

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

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

type RenderWithProvidersOptions = {
  route?: string;
} & Omit<RenderOptions, 'wrapper'>;

export function renderWithProviders(
  ui: ReactNode,
  { route = '/', ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
    renderOptions,
  );
}

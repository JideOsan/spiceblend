import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSpice } from './useSpice';
import { server } from '../../mocks/server';
import { ReactNode } from 'react';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSpice hook', () => {
  it('fetches a spice', async () => {
    const { result } = renderHook(() => useSpice(0), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.spice).toBeDefined();
      expect(result.current.spice?.name).toBeTypeOf('string');
      expect(result.current.spice?.description).toBeTypeOf('string');
    });
  });
});

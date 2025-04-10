import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBlend } from './useBlend';
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

describe('useBlend hook', () => {
  it('fetches a blend', async () => {
    const { result } = renderHook(() => useBlend(0), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.blend).toBeDefined();
      expect(result.current.blend?.blend_ids).toHaveLength(0);
      expect(result.current.blend?.name).toBeTypeOf('string');
      expect(result.current.blend?.description).toBeTypeOf('string');
      expect(result.current.blend?.color).toBeTypeOf('string');
      expect(result.current.blend?.spice_ids.length).toBeGreaterThanOrEqual(0);
      expect(result.current.blend?.blend_ids.length).toBeGreaterThanOrEqual(0);
    });
  });
});

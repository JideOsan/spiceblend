import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateBlend } from './useCreateBlend';
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

describe('useCreateBlend hook', () => {
  it('successfully creates a blend and returns the new blend', async () => {
    const { result } = renderHook(() => useCreateBlend(), {
      wrapper: createWrapper(),
    });

    const newBlend = {
      name: 'Test Blend',
      description: 'This is the testiest of blends every created',
      color: '#ff0000',
      blend_ids: [],
      spice_ids: [],
    };

    result.current.mutate(newBlend);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.blend?.blend_ids).toHaveLength(0);
    expect(result.current.blend?.name).toBe(newBlend.name);
    expect(result.current.blend?.description).toBe(newBlend.description);
    expect(result.current.blend?.color).toBe(newBlend.color);
    expect(result.current.blend?.spice_ids).toHaveLength(0);
  });
});

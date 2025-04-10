import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateBlend } from './useUpdateBlend';
import { server } from '../../mocks/server';
import { ReactNode } from 'react';

const newBlend = {
  id: 1000,
  name: 'Test Blend',
  description: 'This is the testiest of blend ever created',
  color: '#ff0000',
  blend_ids: [],
  spice_ids: [],
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUpdateBlend hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('successfully updates a blend and returns the updated blend', async () => {
    localStorage.setItem('blends', JSON.stringify([newBlend]));

    const { result } = renderHook(() => useUpdateBlend(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      ...newBlend,
      description: 'This is the testiest of blend of all time',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.blend?.blend_ids).toHaveLength(0);
    expect(result.current.blend?.name).toBe(newBlend.name);
    expect(result.current.blend?.description).toBe(
      'This is the testiest of blend of all time',
    );
    expect(result.current.blend?.color).toBe(newBlend.color);
    expect(result.current.blend?.spice_ids).toHaveLength(0);
  });
});

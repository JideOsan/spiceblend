import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBlends } from './useBlends';
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

describe('useBlends hook', () => {
  it('fetches paged data', async () => {
    const { result } = renderHook(() => useBlends(''), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result?.current?.data?.pages[0].data.length).toBeGreaterThanOrEqual(
      3,
    );
  });

  it('fetches searched data', async () => {
    const { result } = renderHook(() => useBlends('tasty'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result?.current?.data?.pages[0].data).toHaveLength(1);
  });

  it('fetches a valid blend', async () => {
    const { result } = renderHook(() => useBlends('tasty'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result?.current?.data?.pages[0].data).toHaveLength(1);
    const fetchedBlend = result?.current?.data?.pages[0].data[0];
    if (fetchedBlend) {
      expect(fetchedBlend.id).toBeTypeOf('number');
      expect(fetchedBlend.name).toBeTypeOf('string');
      expect(fetchedBlend.color).toBeTypeOf('string');
      expect(fetchedBlend.description).toBeTypeOf('string');
      expect(fetchedBlend.spice_ids.length).toBeGreaterThan(0);
      expect(fetchedBlend.blend_ids.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('fetches a valid blend with blends', async () => {
    const { result } = renderHook(() => useBlends('mega'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result?.current?.data?.pages[0].data).toHaveLength(1);
    const fetchedBlend = result?.current?.data?.pages[0].data[0];
    if (fetchedBlend) {
      expect(fetchedBlend.resolved_spices).toHaveLength(14);
    }
  });
});

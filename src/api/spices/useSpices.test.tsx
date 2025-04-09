import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSpices } from './useSpices';
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

describe('useSpices hook', () => {
  it('fetches paged data', async () => {
    const { result } = renderHook(() => useSpices(''), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result?.current?.data?.pages[0].data).toHaveLength(10);
  });

  it('fetches searched data', async () => {
    const { result } = renderHook(() => useSpices('adobo'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result?.current?.data?.pages[0].data).toHaveLength(1);
  });

  it('fetches next page', async () => {
    const { result } = renderHook(() => useSpices(''), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toBeDefined());

    act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() => expect(result?.current?.data?.pages).toHaveLength(2));
  });
});

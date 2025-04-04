import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Spice, ServerResponse } from '../types';

const pageSize = 10;

async function fetchSpices({
  pageParam = 1,
  search = '',
}: {
  pageParam?: unknown;
  search?: string;
}) {
  const response = await fetch(
    `/api/v1/spices?page=${pageParam}&limit=${pageSize}&search=${encodeURIComponent(
      search,
    )}`,
  );
  if (!response.ok) throw new Error('Failed to fetch spices');
  return response.json() as Promise<ServerResponse<Spice[]>>;
}

export function useSpices(search: string) {
  const query = useInfiniteQuery<ServerResponse<Spice[]>, Error>({
    queryKey: ['spices', search],
    queryFn: ({ pageParam = 1 }) => fetchSpices({ pageParam, search }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const spices = useMemo(() => {
    const allSpices = query.data
      ? query.data.pages.flatMap((page) => page.data)
      : [];
    return allSpices;
  }, [query.data]);

  return {
    ...query,
    spices,
  };
}

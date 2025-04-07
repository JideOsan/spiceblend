import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Blend, ServerResponse } from '../types';

const pageSize = 10;

async function fetchBlends({
  pageParam = 1,
  search = '',
}: {
  pageParam?: unknown;
  search?: string;
}) {
  const response = await fetch(
    `/api/v1/blends?page=${pageParam}&limit=${pageSize}&search=${encodeURIComponent(
      search,
    )}`,
  );
  if (!response.ok) throw new Error('Failed to fetch blends');
  return response.json() as Promise<ServerResponse<Blend[]>>;
}

export function useBlends(search: string) {
  const query = useInfiniteQuery<ServerResponse<Blend[]>, Error>({
    queryKey: ['blends', search],
    queryFn: ({ pageParam = 1 }) => fetchBlends({ pageParam, search }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const blends = useMemo(() => {
    const allBlends = query.data
      ? query.data.pages.flatMap((page) => page.data)
      : [];
    return allBlends;
  }, [query.data]);

  return {
    ...query,
    blends,
  };
}

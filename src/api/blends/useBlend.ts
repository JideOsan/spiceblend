import { useQuery } from '@tanstack/react-query';
import type { Blend, ServerResponse } from '../../types';

async function fetchBlend(id: number | string): Promise<ServerResponse<Blend>> {
  const response = await fetch(`/api/v1/blends/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch blend with id ${id}`);
  }

  return response.json() as Promise<ServerResponse<Blend>>;
}

export function useBlend(id: number | string) {
  const query = useQuery<ServerResponse<Blend>, Error>({
    queryKey: ['blend', id],
    queryFn: () => fetchBlend(id),
    enabled: id !== undefined,
  });

  return {
    ...query,
    blend: query.data?.data,
  };
}

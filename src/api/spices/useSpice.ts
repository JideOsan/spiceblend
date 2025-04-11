import { useQuery } from '@tanstack/react-query';
import type { Spice, ServerResponse } from '../../types';

async function fetchSpice(id: number | string): Promise<ServerResponse<Spice>> {
  const response = await fetch(`/api/v1/spices/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch spice with id ${id}`);
  }

  return response.json() as Promise<ServerResponse<Spice>>;
}

export function useSpice(id: number | string) {
  const query = useQuery<ServerResponse<Spice>, Error>({
    queryKey: ['spice', id],
    queryFn: () => fetchSpice(id),
    enabled: id !== undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    ...query,
    spice: query.data?.data,
  };
}

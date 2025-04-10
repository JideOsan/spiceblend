import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Blend, ServerResponse } from '../../types';

type CreateBlendPayload = Omit<
  Blend,
  'id' | 'heat' | 'price' | 'resolved_spices'
>;

async function createBlend(newBlend: CreateBlendPayload) {
  const response = await fetch('/api/v1/blends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBlend),
  });

  if (!response.ok) throw new Error('Failed to create blend');

  return response.json() as Promise<ServerResponse<Blend>>;
}

export const useCreateBlend = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ServerResponse<Blend>,
    Error,
    CreateBlendPayload
  >({
    mutationFn: createBlend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blends'] });
    },
  });

  return {
    ...mutation,
    blend: mutation.data?.data,
  };
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Blend, ServerResponse } from '../../types';

type UpdateBlendPayload = Omit<Blend, 'heat' | 'price' | 'resolved_spices'>;

async function updateBlend(blend: UpdateBlendPayload) {
  const response = await fetch(`/api/v1/blends/${blend.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blend),
  });

  if (!response.ok) throw new Error('Failed to update blend');

  return response.json() as Promise<ServerResponse<Blend>>;
}

export function useUpdateBlend() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ServerResponse<Blend>,
    Error,
    UpdateBlendPayload
  >({
    mutationFn: updateBlend,
    onSuccess: ({ data: updatedBlend }) => {
      queryClient.setQueryData(['blend', updatedBlend.id], updatedBlend);
      queryClient.invalidateQueries({ queryKey: ['blends'] });
    },
  });

  return {
    ...mutation,
    blend: mutation.data?.data,
  };
}

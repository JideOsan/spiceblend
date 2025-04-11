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
    onSuccess: (response) => {
      queryClient.setQueryData(['blend', response.data.id], response);
      queryClient.invalidateQueries({ queryKey: ['blends'] });
    },
  });

  const addSpice = async (blend: Blend, spiceId: number) => {
    const spice_ids = Array.from(new Set([...blend.spice_ids, spiceId]));
    await mutation.mutateAsync({ ...blend, spice_ids });
  };

  const removeSpice = async (blend: Blend, spiceId: number) => {
    const spice_ids = blend.spice_ids.filter((id) => id !== spiceId);
    await mutation.mutateAsync({ ...blend, spice_ids });
  };

  return {
    ...mutation,
    addSpice,
    removeSpice,
    blend: mutation.data?.data,
  };
}

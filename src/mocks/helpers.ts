import { Blend, BlendSpice, Spice } from '../types';

export function resolveSpices(blend: Blend, blends: Blend[], spices: Spice[]) {
  function flattenBlendIds(
    blend: Blend,
    blendMap: Map<number, Blend>,
    aggrgateBlends: number[] = [],
  ) {
    aggrgateBlends = [...aggrgateBlends, blend.id];

    blend.blend_ids.forEach((id) => {
      if (!aggrgateBlends.includes(id)) {
        const deepBlend = blendMap.get(id);
        if (!deepBlend) throw Error('Invalid blend id:' + id);
        aggrgateBlends = flattenBlendIds(deepBlend, blendMap, aggrgateBlends);
      }
    });

    return aggrgateBlends;
  }

  const blendMap = new Map(blends.map((b) => [b.id, b]));
  const includedBlendsIds = flattenBlendIds(blend, blendMap);

  const resolvedSpices: Map<number, BlendSpice> = new Map();
  const spiceMap = new Map(spices.map((s) => [s.id, s]));

  includedBlendsIds.forEach((id) => {
    const includedBlend = blendMap.get(id);
    if (!includedBlend) throw Error('Invalid blend id:' + id);
    includedBlend.spice_ids.forEach((id) => {
      const includedBlendSpice = resolvedSpices.get(id);
      if (includedBlendSpice) {
        resolvedSpices.set(id, {
          ...includedBlendSpice,
          blend_ids: [...includedBlendSpice.blend_ids, includedBlend.id],
        });
      } else {
        const newIncludedBlendSpice = spiceMap.get(id);
        if (newIncludedBlendSpice) {
          resolvedSpices.set(id, {
            ...newIncludedBlendSpice,
            blend_ids: [newIncludedBlendSpice.id],
          });
        }
      }
    });
  });

  return Array.from(resolvedSpices.values());
}

export function getAveHeatAndPrice(blendSpices: BlendSpice[]) {
  let totalHeat = 0;
  let totalPrice = 0;
  const spiceCount = blendSpices.length || 0;

  blendSpices.forEach((spice) => {
    totalHeat += spice.heat;
    totalPrice += spice.price.length;
  });

  return {
    heat: Math.round(totalHeat / spiceCount),
    price: '$'.repeat(Math.round(totalPrice / spiceCount)),
  };
}

export const createBlend = (blend: Partial<Blend> = {}): Blend => {
  return {
    id: Date.now(),
    name: 'New Blend',
    description: 'A custom spice blend.',
    color: '#ffffff',
    blend_ids: [],
    spice_ids: [],
    ...blend,
  };
};

export const mergeLocalBlends = (blends: Blend[]): Blend[] => {
  const localBlends: Blend[] = JSON.parse(
    localStorage.getItem('blends') || '[]',
  );
  return [...blends, ...localBlends];
};

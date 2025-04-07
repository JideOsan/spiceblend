import { http, HttpResponse } from 'msw';
import { data as mockSpices } from './data/spices';
import { data as mockBlends } from './data/blends';
import { Blend, BlendSpice } from '../types';

function resolveSpices(blend: Blend, blends: Blend[]) {
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
  const spiceMap = new Map(mockSpices().map((s) => [s.id, s]));

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

function getAveHeatAndPrice(blendSpices: BlendSpice[]) {
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

export const handlers = [
  http.get('/api/v1/spices', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    let spices = mockSpices();

    if (search) {
      spices = spices.filter((spice) =>
        spice.name.toLowerCase().includes(search),
      );
    }

    const total = spices.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSpices = spices.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedSpices,
      page,
      limit,
      total,
      totalPages,
    });
  }),

  http.get('/api/v1/spices/:id', ({ params }) => {
    const spice = mockSpices().find((spice) => spice.id === Number(params.id));

    if (!spice) {
      return new HttpResponse('Not found', { status: 404 });
    }

    return HttpResponse.json({ data: spice });
  }),

  http.get('/api/v1/blends', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    const blends = mockBlends();

    let filteredBlends = search
      ? blends.filter((blend) => blend.name.toLowerCase().includes(search))
      : blends;

    filteredBlends = filteredBlends.map((blend) => {
      const resolvedSpices = resolveSpices(blend, blends);
      const { heat, price } = getAveHeatAndPrice(resolvedSpices);
      return {
        ...blend,
        heat,
        price,
        resolved_spices: resolvedSpices,
      };
    });

    return HttpResponse.json({
      data: filteredBlends,
    });
  }),

  http.post('/api/v1/blends', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/v1/blends/:id', ({ params }) => {
    const blends = mockBlends();
    const blend = blends.find((blend) => blend.id === Number(params.id));

    if (!blend) {
      return new HttpResponse('Not found', { status: 404 });
    }

    const resolvedSpices = resolveSpices(blend, blends);
    const { heat, price } = getAveHeatAndPrice(resolvedSpices);

    return HttpResponse.json({
      data: {
        ...blend,
        heat,
        price,
        resolved_spices: resolvedSpices,
      },
    });
  }),
];

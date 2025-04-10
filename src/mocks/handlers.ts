import { http, HttpResponse } from 'msw';
import { data as mockSpices } from './data/spices';
import { data as mockBlends } from './data/blends';
import { Blend } from '../types';
import {
  createBlend,
  getAveHeatAndPrice,
  resolveSpices,
  mergeLocalBlends,
} from './helpers';

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

    const blends = mergeLocalBlends(mockBlends());

    let filteredBlends = search
      ? blends.filter((blend) => blend.name.toLowerCase().includes(search))
      : blends;

    const spices = mockSpices();

    filteredBlends = filteredBlends.map((blend) => {
      const resolvedSpices = resolveSpices(blend, blends, spices);
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

  http.post('/api/v1/blends', async ({ request }) => {
    const body = (await request.json()) as object | undefined | null;

    if (!body)
      return HttpResponse.json({
        success: false,
        code: 401,
        message: 'Invalid Body',
      });

    const newBlend: Blend = createBlend(body);

    const localBlends: Blend[] = JSON.parse(
      localStorage.getItem('blends') || '[]',
    );

    const updatedLocalBlends = [...localBlends, newBlend];

    localStorage.setItem('blends', JSON.stringify(updatedLocalBlends));

    const blends = [...mockBlends(), ...updatedLocalBlends];
    const resolvedSpices = resolveSpices(newBlend, blends, mockSpices());
    const { heat, price } = getAveHeatAndPrice(resolvedSpices);

    return HttpResponse.json({
      data: {
        ...newBlend,
        heat,
        price,
        resolved_spices: resolvedSpices,
      },
    });
  }),

  http.put('/api/v1/blends/:id', async ({ request, params }) => {
    const body = (await request.json()) as Partial<Blend> | undefined | null;
    const { id } = params;

    if (!id || !body) {
      return HttpResponse.json({
        success: false,
        code: 400,
        message: 'Missing ID or body',
      });
    }

    const blendId = parseInt(id as string, 10);
    const localBlends: Blend[] = JSON.parse(
      localStorage.getItem('blends') || '[]',
    );

    const existingBlend = localBlends.find((b) => b.id === blendId);
    if (!existingBlend) {
      return HttpResponse.json({
        success: false,
        code: 404,
        message: 'Blend not found',
      });
    }

    const updatedBlend: Blend = {
      ...existingBlend,
      ...body,
      id: existingBlend.id,
    };

    const updatedLocalBlends = localBlends.map((b) =>
      b.id === updatedBlend.id ? updatedBlend : b,
    );

    localStorage.setItem('blends', JSON.stringify(updatedLocalBlends));

    const blends = [...mockBlends(), ...updatedLocalBlends];
    const resolvedSpices = resolveSpices(updatedBlend, blends, mockSpices());
    const { heat, price } = getAveHeatAndPrice(resolvedSpices);

    return HttpResponse.json({
      success: true,
      data: {
        ...updatedBlend,
        heat,
        price,
        resolved_spices: resolvedSpices,
      },
    });
  }),

  http.get('/api/v1/blends/:id', ({ params }) => {
    const blends = mockBlends();
    const blend = blends.find((blend) => blend.id === Number(params.id));

    if (!blend) {
      return new HttpResponse('Not found', { status: 404 });
    }

    const resolvedSpices = resolveSpices(blend, blends, mockSpices());
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

import { http, HttpResponse } from 'msw';
import { data as mockSpices } from './data/spices';
import { data as mockBlends } from './data/blends';

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

    return HttpResponse.json(spice);
  }),

  http.get('/api/v1/blends', () => {
    return HttpResponse.json(mockBlends());
  }),

  http.post('/api/v1/blends', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/v1/blends/:id', ({ params }) => {
    const blend = mockBlends().find((blend) => blend.id === Number(params.id));

    if (!blend) {
      return new HttpResponse('Not found', { status: 404 });
    }

    return HttpResponse.json(blend);
  }),
];

import { render, screen } from '@testing-library/react';
import SpiceDetail from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const originalRouter = await vi.importActual('react-router-dom');
  return {
    ...originalRouter,
    useParams: () => {
      return {
        id: '0',
      };
    },
  };
});

const queryClient = new QueryClient();

test('renders spice detail page', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <SpiceDetail />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  expect(
    screen.getByRole('heading', { level: 1, name: /spice/i }),
  ).toBeInTheDocument();
});

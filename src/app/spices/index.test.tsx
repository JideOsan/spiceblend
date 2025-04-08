import { render, screen } from '@testing-library/react';
import Spices from './index';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

test('renders home page', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Spices />
      </MemoryRouter>
    </QueryClientProvider>,
  );

  expect(
    await screen.findByRole('heading', { name: /spices/i }),
  ).toBeInTheDocument();
});

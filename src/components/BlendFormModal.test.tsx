import { render, screen } from '@testing-library/react';
import BlendFormModal from './BlendFormModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const queryClient = new QueryClient();

describe('Create Blend Form', () => {
  it('renders with modal', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={['/blends?modal=create-blend']}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <BlendFormModal />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Lets create a new Blend' }),
    ).toBeInTheDocument();
  });
});

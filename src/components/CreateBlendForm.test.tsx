import { render, screen } from '@testing-library/react';
import CreateBlendForm from './CreateBlendForm';

describe('Create Blend Form', () => {

  it('renders with modal', () => {
    render(
      <CreateBlendForm />,
    );

    expect(screen.getByRole('heading', { name: 'Lets create a new Blend' })).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {

  it('renders an open modal', async () => {

    render(
      <Modal isOpen={true} onClose={() => {}}><div>Hello Modal</div></Modal>,
    );

    expect(screen.getByText("Hello Modal")).toBeInTheDocument();
  });
});

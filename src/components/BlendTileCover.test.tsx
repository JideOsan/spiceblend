import { render, screen } from '@testing-library/react';
import BlendTileCover from './BlendTileCover';
import { Blend } from '../types';

describe('Blend Tile Cover', () => {
  it('renders an blend tile', async () => {
    const blend: Blend = {
      id: 0,
      name: 'Test Blend',
      description: 'A cool new Blend',
      color: '#ffffff',
      spice_ids: [],
      blend_ids: [],
    };

    render(<BlendTileCover blend={blend} />);

    expect(screen.getByText('Test Blend')).toBeInTheDocument();
  });
});

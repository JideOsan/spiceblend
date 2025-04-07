import { Blend } from '../../types';

export const data: () => Blend[] = () => [
  {
    id: 0,
    name: 'Tasty Blend',
    blend_ids: [],
    spice_ids: [1, 5, 35, 52],
    color: '#0F807D',
    description: 'This is a tasty spice blend',
  },
  {
    id: 1,
    name: 'Blendy Blend',
    blend_ids: [0],
    spice_ids: [2, 6, 37, 246],
    color: '#FCB730',
    description: 'This is a spice blend with another blend',
  },
  {
    id: 2,
    name: 'Meta Blend',
    blend_ids: [0, 1],
    spice_ids: [400, 401, 402, 403],
    color: '#FB7563',
    description: 'This is a spice blend with many blends',
  },
  {
    id: 3,
    name: 'Mega Blend',
    blend_ids: [2, 1],
    spice_ids: [2, 35, 450, 451],
    color: '#FB7563',
    description: 'This is a spice blend with overlaping blends',
  },
];

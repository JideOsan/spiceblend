export interface Spice {
  id: number;
  name: string;
  description: string;
  color: string;
  heat: number;
  price: string;
  image?: string;
}

export interface BlendSpice extends Spice {
  blend_ids: number[]; //the ids of the nested blend this spice belongs to
}

export interface Blend {
  id: number;
  name: string;
  description: string;
  color: string;
  image?: string;
  blend_ids: number[];
  spice_ids: number[];
  resolved_spices?: BlendSpice[];
}

export interface ServerResponse<T> {
  data: T;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

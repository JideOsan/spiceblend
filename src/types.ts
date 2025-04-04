export interface Spice {
  color: string;
  heat: number;
  id: number;
  description?: string;
  image?: string;
  name: string;
  price: string;
}

export interface Blend {
  blends: number[];
  description: string;
  id: number;
  name: string;
  spices: number[];
}

export interface ServerResponse<T> {
  data: T;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

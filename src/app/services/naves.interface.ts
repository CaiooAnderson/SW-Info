export interface Nave {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  crew: string;
  image: string;
  hyperdrive_rating: string;
  films: string[];
  pilots: string[];
}

export interface RespostaAPI<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
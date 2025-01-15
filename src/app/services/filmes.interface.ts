export interface Filme {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
  }
  
  export interface RespostaAPI<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
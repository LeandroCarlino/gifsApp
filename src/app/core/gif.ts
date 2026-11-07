export interface GifMedia {
  url: string;
  width: string;
  height: string;
}

export interface Gif {
  id: string;
  title: string;
  url: string;
  images: {
    fixed_width: GifMedia;
    downsized_medium: GifMedia;
    original: GifMedia;
  };
}

export interface GiphyRespuesta {
  data: Gif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

export interface Config {
  giphyApiKey: string;
}

/** Etiquetas sugeridas cuando todavía no hay búsqueda. */
export const TAGS = [
  'anime',
  'lofi',
  'developer',
  'gaming',
  'tokyo',
  'cat',
  'space',
  'coffee',
] as const;

export const LIMITE = 24;

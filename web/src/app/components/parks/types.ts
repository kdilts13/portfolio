export type Park = {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  wikipediaSlug: string;
};

export type ParkWikiData = {
  summary: string | null;
  imageUrl: string | null;
  pageUrl: string | null;
};

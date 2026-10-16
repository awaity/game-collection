import catalog from "../../../catalog/games.json";
export interface GameEntry {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  coverAlt: string;
  coverPosition: string;
  theme: string;
  badge: string;
  tags: string[];
  duration: string;
  controls: { touch: string; keyboard: string };
  tip: string;
}
export const games: GameEntry[] = catalog;
export const gameHref = (slug: string) =>
  `${import.meta.env.BASE_URL}games/${slug}/`;
export const assetHref = (asset: string) =>
  `${import.meta.env.BASE_URL}${asset}`;

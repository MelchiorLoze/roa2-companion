import { type Category } from '@/types/item';

const CDN_BASE_URL = 'https://cdn.roa2-companion.app';

export const imageUrlFromFriendlyId = (category: Category, friendlyId: string): URL => {
  return new URL(`/${category}/${friendlyId}.png`, CDN_BASE_URL);
};

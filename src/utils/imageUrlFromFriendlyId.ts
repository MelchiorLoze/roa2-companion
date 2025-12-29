import { COMPANION_CDN_BASE_URL } from '@/constants';
import { type Category } from '@/types/item';

export const imageUrlFromFriendlyId = (category: Category, friendlyId: string): URL => {
  return new URL(`/${category}/${friendlyId}.png`, COMPANION_CDN_BASE_URL);
};

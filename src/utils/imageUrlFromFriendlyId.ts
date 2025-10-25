import { type Category } from '@/types/item';

const CDN_BASE_URL = 'https://d1gftqja5mgfxj.cloudfront.net';

export const imageUrlFromFriendlyId = (category: Category, friendlyId: string): URL => {
  return new URL(`/${category}/${friendlyId}.png`, CDN_BASE_URL);
};

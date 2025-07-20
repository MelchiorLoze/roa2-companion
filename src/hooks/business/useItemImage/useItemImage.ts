import { Skia, type SkImage } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';

import { type Item } from '@/types/item';

export const CDN_BASE_URL = 'https://d1gftqja5mgfxj.cloudfront.net';

const pendingRequests = new Map<string, Promise<SkImage | null>>();

const retrieveOrFetchImage = async (item: Pick<Item, 'friendlyId' | 'category'>): Promise<SkImage | null> => {
  try {
    const url = new URL(`/${item.category}/${item.friendlyId}.png`, CDN_BASE_URL).toString();
    let uri = await Image.getCachePathAsync(url);

    if (!uri) {
      await Image.prefetch(url);
      uri = await Image.getCachePathAsync(url);
    }

    if (uri) {
      const data = await Skia.Data.fromURI('file://' + uri);
      const skImage = Skia.Image.MakeImageFromEncoded(data);
      return skImage;
    }
  } catch (error) {
    console.error(`Couldn't load or process image '${item.friendlyId}':`, error);
  }
  return null;
};

export const useItemImage = (item: Pick<Item, 'friendlyId' | 'category'>): SkImage | null => {
  const [image, setImage] = useState<SkImage | null>(null);

  useEffect(() => {
    let imagePromise = pendingRequests.get(item.friendlyId);

    if (!imagePromise) {
      imagePromise = retrieveOrFetchImage(item);
      pendingRequests.set(item.friendlyId, imagePromise);

      void imagePromise.finally(() => pendingRequests.delete(item.friendlyId));
    }

    void imagePromise.then(setImage);
  }, [item]);

  return image;
};

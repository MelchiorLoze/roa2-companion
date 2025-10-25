import { type CanvasRef, FilterMode, Skia, type SkImage, type SkSize, useCanvasSize } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';

const PIXEL_ART_SIZE_THRESHOLD = 256;

const pendingRequests = new Map<string, Promise<SkImage | null>>();

const retrieveOrFetchImage = async (url: URL): Promise<SkImage | null> => {
  try {
    const urlString = url.toString();
    let uri = await Image.getCachePathAsync(urlString);

    if (!uri) {
      await Image.prefetch(urlString);
      uri = await Image.getCachePathAsync(urlString);
    }

    if (uri) {
      const data = await Skia.Data.fromURI('file://' + uri);
      const skImage = Skia.Image.MakeImageFromEncoded(data);
      return skImage;
    }
  } catch (error) {
    console.error(`Couldn't load or process image from '${url}':`, error);
  }

  return null;
};

type UseCachedSkiaImageResult = {
  image: SkImage | null;
  canvasRef: React.RefObject<CanvasRef | null>;
  canvasSize: SkSize;
  canvasFilter: FilterMode;
};

export const useCachedSkiaImage = (url: URL): UseCachedSkiaImageResult => {
  const { ref: canvasRef, size: canvasSize } = useCanvasSize();
  const [image, setImage] = useState<SkImage | null>(null);

  const canvasFilter = image && image.width() > PIXEL_ART_SIZE_THRESHOLD ? FilterMode.Linear : FilterMode.Nearest;

  useEffect(() => {
    const requestId = url.pathname;
    let imagePromise = pendingRequests.get(requestId);

    if (!imagePromise) {
      imagePromise = retrieveOrFetchImage(url);
      pendingRequests.set(requestId, imagePromise);

      void imagePromise.finally(() => pendingRequests.delete(requestId));
    }

    void imagePromise.then(setImage);
  }, [url]);

  return { image, canvasRef, canvasSize, canvasFilter };
};

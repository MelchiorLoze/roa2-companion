import { FilterMode, Skia, type SkImage, useCanvasSize } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';

const PIXEL_ART_SIZE_THRESHOLD = 256;

const pendingRequests = new Map<string, Promise<SkImage | null>>();
const resolvedCache = new Map<string, SkImage>();

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

export const useCachedSkiaImage = (url: URL) => {
  const { ref: canvasRef, size: canvasSize } = useCanvasSize();
  const [image, setImage] = useState<SkImage | null>(null);

  const canvasFilter = image && image.width() > PIXEL_ART_SIZE_THRESHOLD ? FilterMode.Linear : FilterMode.Nearest;

  useEffect(() => {
    const requestId = url.toString();
    let active = true;

    const cached = resolvedCache.get(requestId);
    if (cached) {
      setImage(cached);
      return () => {
        active = false;
      };
    }

    setImage(null);

    let imagePromise = pendingRequests.get(requestId);

    if (!imagePromise) {
      imagePromise = retrieveOrFetchImage(url);
      pendingRequests.set(requestId, imagePromise);

      void imagePromise.finally(() => pendingRequests.delete(requestId));
    }

    void imagePromise.then((resolved) => {
      if (resolved && active) {
        resolvedCache.set(requestId, resolved);
        setImage(resolved);
      } else if (active && resolved === null) {
        setImage(null);
      } else if (resolved && !active) {
        // Disposed if not used - but we don't want to leak? Or let cache keep it
        // Cache keeps resolved images per recommendation
      }
    });

    return () => {
      active = false;
    };
  }, [url]);

  return { image, canvasRef, canvasSize, canvasFilter } as const;
};

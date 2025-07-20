import { type SkData, Skia, type SkImage } from '@shopify/react-native-skia';
import { renderHook, waitFor } from '@testing-library/react-native';
import { Image } from 'expo-image';

import { Category, type Item } from '@/types/item';

import { useItemImage } from './useItemImage';

jest.mock('@shopify/react-native-skia', () => ({
  Skia: {
    Data: {
      fromURI: jest.fn(),
    },
    Image: {
      MakeImageFromEncoded: jest.fn(),
    },
  },
}));
const SkiaMock = jest.mocked(Skia);
// eslint-disable-next-line @typescript-eslint/unbound-method
const fromURIMock = SkiaMock.Data.fromURI;
const makeImageFromEncodedMock = SkiaMock.Image.MakeImageFromEncoded;

jest.mock('expo-image', () => ({
  Image: {
    getCachePathAsync: jest.fn(),
    prefetch: jest.fn(),
  },
}));
const ImageMock = jest.mocked(Image);
const getCachePathAsyncMock = ImageMock.getCachePathAsync;
const prefetchMock = ImageMock.prefetch;

const itemMock: Pick<Item, 'friendlyId' | 'category'> = {
  friendlyId: 'test-item-123',
  category: Category.SKIN,
};
const cachePathMock = '/cache/path/test-item-123.png';
const skDataMock = {} as SkData;
const skImageMock = {} as SkImage;

describe('useItemImage', () => {
  describe('when image is already cached', () => {
    it('returns the cached image without prefetching', async () => {
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValue(skImageMock);

      const { result } = renderHook(() => useItemImage(itemMock));

      expect(result.current).toBe(null);

      await waitFor(() => expect(result.current).toBe(skImageMock));

      expect(getCachePathAsyncMock).toHaveBeenCalledWith(
        'https://d1gftqja5mgfxj.cloudfront.net/skin/test-item-123.png',
      );
      expect(prefetchMock).not.toHaveBeenCalled();
      expect(fromURIMock).toHaveBeenCalledWith('file:///cache/path/test-item-123.png');
      expect(makeImageFromEncodedMock).toHaveBeenCalledWith(skDataMock);
    });
  });

  describe('when image is not cached', () => {
    it('prefetches the image and returns it after caching', async () => {
      getCachePathAsyncMock
        .mockResolvedValueOnce(null) // First call returns null (not cached)
        .mockResolvedValueOnce(cachePathMock); // Second call returns the cache path after prefetch
      prefetchMock.mockResolvedValue(true);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValue(skImageMock);

      const { result } = renderHook(() => useItemImage(itemMock));

      expect(result.current).toBe(null);

      await waitFor(() => expect(result.current).toBe(skImageMock));

      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2);
      expect(prefetchMock).toHaveBeenCalledWith('https://d1gftqja5mgfxj.cloudfront.net/skin/test-item-123.png');
      expect(fromURIMock).toHaveBeenCalledWith('file:///cache/path/test-item-123.png');
      expect(makeImageFromEncodedMock).toHaveBeenCalledWith(skDataMock);
    });

    it('returns null when prefetch fails to cache the image', async () => {
      getCachePathAsyncMock.mockResolvedValue(null);
      prefetchMock.mockResolvedValue(true);

      const { result } = renderHook(() => useItemImage(itemMock));

      expect(result.current).toBe(null);

      await waitFor(() => expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2));

      expect(result.current).toBe(null);
      expect(prefetchMock).toHaveBeenCalledWith('https://d1gftqja5mgfxj.cloudfront.net/skin/test-item-123.png');
      expect(fromURIMock).not.toHaveBeenCalled();
      expect(makeImageFromEncodedMock).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('returns null when getCachePathAsync throws an error', async () => {
      const originalConsoleError = console.error;
      const consoleErrorMock = jest.fn();
      console.error = consoleErrorMock;
      getCachePathAsyncMock.mockRejectedValue(new Error('Cache path error'));

      const { result } = renderHook(() => useItemImage(itemMock));

      expect(result.current).toBe(null);

      await waitFor(() =>
        expect(consoleErrorMock).toHaveBeenCalledWith(
          "Couldn't load or process image 'test-item-123':",
          expect.any(Error),
        ),
      );

      expect(result.current).toBe(null);
      console.error = originalConsoleError;
    });

    it('returns null when prefetch throws an error', async () => {
      const originalConsoleError = console.error;
      const consoleErrorMock = jest.fn();
      console.error = consoleErrorMock;

      getCachePathAsyncMock.mockResolvedValue(null);
      prefetchMock.mockRejectedValue(new Error('Prefetch error'));

      const { result } = renderHook(() => useItemImage(itemMock));

      expect(result.current).toBe(null);

      await waitFor(() =>
        expect(consoleErrorMock).toHaveBeenCalledWith(
          "Couldn't load or process image 'test-item-123':",
          expect.any(Error),
        ),
      );

      expect(result.current).toBe(null);
      console.error = originalConsoleError;
    });

    it('returns null when Skia operations throw an error', async () => {
      const originalConsoleError = console.error;
      const consoleErrorMock = jest.fn();
      console.error = consoleErrorMock;
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockRejectedValue(new Error('Skia data error'));

      const { result } = renderHook(() => useItemImage(itemMock));

      expect(result.current).toBe(null);

      await waitFor(() =>
        expect(consoleErrorMock).toHaveBeenCalledWith(
          "Couldn't load or process image 'test-item-123':",
          expect.any(Error),
        ),
      );

      expect(result.current).toBe(null);
      console.error = originalConsoleError;
    });
  });

  describe('request deduplication', () => {
    it('uses the same promise for concurrent requests with the same friendlyId', async () => {
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValue(skImageMock);

      const { result: result1 } = renderHook(() => useItemImage(itemMock));
      const { result: result2 } = renderHook(() => useItemImage(itemMock));

      expect(result1.current).toBe(null);
      expect(result2.current).toBe(null);

      await waitFor(() => {
        expect(result1.current).toBe(skImageMock);
        expect(result2.current).toBe(skImageMock);
      });

      // Should only call getCachePathAsync once due to deduplication
      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(1);
      expect(fromURIMock).toHaveBeenCalledTimes(1);
      expect(makeImageFromEncodedMock).toHaveBeenCalledTimes(1);
    });

    it('makes separate requests for different friendlyIds', async () => {
      const otherItemMock: Pick<Item, 'friendlyId' | 'category'> = {
        friendlyId: 'test-item-456',
        category: Category.ICON,
      };
      const otherCachePathMock = '/cache/path/test-item-456.png';
      const otherSkImageMock = {} as SkImage;

      getCachePathAsyncMock.mockResolvedValueOnce(cachePathMock).mockResolvedValueOnce(otherCachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValueOnce(skImageMock).mockReturnValueOnce(otherSkImageMock);

      const { result: result1 } = renderHook(() => useItemImage(itemMock));
      const { result: result2 } = renderHook(() => useItemImage(otherItemMock));

      await waitFor(() => {
        expect(result1.current).toBe(skImageMock);
        expect(result2.current).toBe(otherSkImageMock);
      });

      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2);
      expect(getCachePathAsyncMock).toHaveBeenNthCalledWith(
        1,
        'https://d1gftqja5mgfxj.cloudfront.net/skin/test-item-123.png',
      );
      expect(getCachePathAsyncMock).toHaveBeenNthCalledWith(
        2,
        'https://d1gftqja5mgfxj.cloudfront.net/icon/test-item-456.png',
      );
    });
  });

  describe('when friendlyId changes', () => {
    it('fetches the new image and updates the result', async () => {
      const otherItemMock: Pick<Item, 'friendlyId' | 'category'> = {
        friendlyId: 'test-item-789',
        category: Category.ICON,
      };
      const otherCachePathMock = '/cache/path/test-item-789.png';
      const otherSkImageMock = {} as SkImage;

      getCachePathAsyncMock.mockResolvedValueOnce(cachePathMock).mockResolvedValueOnce(otherCachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValueOnce(skImageMock).mockReturnValueOnce(otherSkImageMock);

      const { result, rerender } = renderHook(({ itemMock }) => useItemImage(itemMock), {
        initialProps: { itemMock: itemMock },
      });

      // Wait for the first image to load
      await waitFor(() => expect(result.current).toBe(skImageMock));

      // Change the friendlyId
      rerender({ itemMock: otherItemMock });

      // Should eventually get the second image
      await waitFor(() => expect(result.current).toBe(otherSkImageMock));

      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2);
      expect(makeImageFromEncodedMock).toHaveBeenCalledTimes(2);
    });
  });
});

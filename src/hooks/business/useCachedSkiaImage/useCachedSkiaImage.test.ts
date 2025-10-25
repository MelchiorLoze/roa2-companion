import { type SkData, Skia, type SkImage } from '@shopify/react-native-skia';
import { renderHook, waitFor } from '@testing-library/react-native';
import { Image } from 'expo-image';

import { useCachedSkiaImage } from './useCachedSkiaImage';

jest.mock('@shopify/react-native-skia', () => ({
  Skia: {
    Data: {
      fromURI: jest.fn(),
    },
    Image: {
      MakeImageFromEncoded: jest.fn(),
    },
  },
  useCanvasSize: () => ({
    ref: null,
    size: { width: 0, height: 0 },
  }),
  FilterMode: {
    Nearest: 0,
    Linear: 1,
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

const urlMock = new URL('https://www.example.com/skin/test-item-123.png');
const cachePathMock = '/cache/path/test-item-123.png';
const skDataMock = {} as SkData;
const skImageMock = { width: () => 300 } as SkImage;

describe('useCachedSkiaImage', () => {
  describe('when image is already cached', () => {
    it('returns the cached image without prefetching', async () => {
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValue(skImageMock);

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      expect(result.current.image).toBe(null);

      await waitFor(() => expect(result.current.image).toBe(skImageMock));

      expect(getCachePathAsyncMock).toHaveBeenCalledWith('https://www.example.com/skin/test-item-123.png');
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

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      expect(result.current.image).toBe(null);

      await waitFor(() => expect(result.current.image).toBe(skImageMock));

      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2);
      expect(prefetchMock).toHaveBeenCalledWith('https://www.example.com/skin/test-item-123.png');
      expect(fromURIMock).toHaveBeenCalledWith('file:///cache/path/test-item-123.png');
      expect(makeImageFromEncodedMock).toHaveBeenCalledWith(skDataMock);
    });

    it('returns null when prefetch fails to cache the image', async () => {
      getCachePathAsyncMock.mockResolvedValue(null);
      prefetchMock.mockResolvedValue(true);

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      expect(result.current.image).toBe(null);

      await waitFor(() => expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2));

      expect(result.current.image).toBe(null);
      expect(prefetchMock).toHaveBeenCalledWith('https://www.example.com/skin/test-item-123.png');
      expect(fromURIMock).not.toHaveBeenCalled();
      expect(makeImageFromEncodedMock).not.toHaveBeenCalled();
    });
  });

  describe('canvas filter mode', () => {
    it('uses Nearest filter for pixel art images', async () => {
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      const pixelArtImageMock = { width: () => 100 } as SkImage;
      makeImageFromEncodedMock.mockReturnValue(pixelArtImageMock);

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      await waitFor(() => expect(result.current.image).toBe(pixelArtImageMock));

      expect(result.current.canvasFilter).toBe(0); // FilterMode.Nearest
    });

    it('uses Linear filter for larger images', async () => {
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      const largerImageMock = { width: () => 1500 } as SkImage;
      makeImageFromEncodedMock.mockReturnValue(largerImageMock);

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      await waitFor(() => expect(result.current.image).toBe(largerImageMock));

      expect(result.current.canvasFilter).toBe(1); // FilterMode.Linear
    });
  });

  describe('error handling', () => {
    it('returns null when getCachePathAsync throws an error', async () => {
      const originalConsoleError = console.error;
      const consoleErrorMock = jest.fn();
      console.error = consoleErrorMock;
      getCachePathAsyncMock.mockRejectedValue(new Error('Cache path error'));

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      expect(result.current.image).toBe(null);

      await waitFor(() =>
        expect(consoleErrorMock).toHaveBeenCalledWith(
          "Couldn't load or process image from 'https://www.example.com/skin/test-item-123.png':",
          expect.any(Error),
        ),
      );

      expect(result.current.image).toBe(null);
      console.error = originalConsoleError;
    });

    it('returns null when prefetch throws an error', async () => {
      const originalConsoleError = console.error;
      const consoleErrorMock = jest.fn();
      console.error = consoleErrorMock;

      getCachePathAsyncMock.mockResolvedValue(null);
      prefetchMock.mockRejectedValue(new Error('Prefetch error'));

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      expect(result.current.image).toBe(null);

      await waitFor(() =>
        expect(consoleErrorMock).toHaveBeenCalledWith(
          "Couldn't load or process image from 'https://www.example.com/skin/test-item-123.png':",
          expect.any(Error),
        ),
      );

      expect(result.current.image).toBe(null);
      console.error = originalConsoleError;
    });

    it('returns null when Skia operations throw an error', async () => {
      const originalConsoleError = console.error;
      const consoleErrorMock = jest.fn();
      console.error = consoleErrorMock;
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockRejectedValue(new Error('Skia data error'));

      const { result } = renderHook(() => useCachedSkiaImage(urlMock));

      expect(result.current.image).toBe(null);

      await waitFor(() =>
        expect(consoleErrorMock).toHaveBeenCalledWith(
          "Couldn't load or process image from 'https://www.example.com/skin/test-item-123.png':",
          expect.any(Error),
        ),
      );

      expect(result.current.image).toBe(null);
      console.error = originalConsoleError;
    });
  });

  describe('request deduplication', () => {
    it('uses the same promise for concurrent requests with the same friendlyId', async () => {
      getCachePathAsyncMock.mockResolvedValue(cachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValue(skImageMock);

      const { result: result1 } = renderHook(() => useCachedSkiaImage(urlMock));
      const { result: result2 } = renderHook(() => useCachedSkiaImage(urlMock));

      expect(result1.current.image).toBe(null);
      expect(result2.current.image).toBe(null);

      await waitFor(() => {
        expect(result1.current.image).toBe(skImageMock);
        expect(result2.current.image).toBe(skImageMock);
      });

      // Should only call getCachePathAsync once due to deduplication
      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(1);
      expect(fromURIMock).toHaveBeenCalledTimes(1);
      expect(makeImageFromEncodedMock).toHaveBeenCalledTimes(1);
    });

    it('makes separate requests for different friendlyIds', async () => {
      const otherUrlMock = new URL('https://www.example.com/icon/test-item-456.png');
      const otherCachePathMock = '/cache/path/test-item-456.png';
      const otherSkImageMock = { width: () => 300 } as SkImage;

      getCachePathAsyncMock.mockResolvedValueOnce(cachePathMock).mockResolvedValueOnce(otherCachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValueOnce(skImageMock).mockReturnValueOnce(otherSkImageMock);

      const { result: result1 } = renderHook(() => useCachedSkiaImage(urlMock));
      const { result: result2 } = renderHook(() => useCachedSkiaImage(otherUrlMock));

      await waitFor(() => {
        expect(result1.current.image).toBe(skImageMock);
        expect(result2.current.image).toBe(otherSkImageMock);
      });

      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2);
      expect(getCachePathAsyncMock).toHaveBeenNthCalledWith(1, 'https://www.example.com/skin/test-item-123.png');
      expect(getCachePathAsyncMock).toHaveBeenNthCalledWith(2, 'https://www.example.com/icon/test-item-456.png');
    });
  });

  describe('when friendlyId changes', () => {
    it('fetches the new image and updates the result', async () => {
      const otherUrlMock = new URL('https://www.example.com/icon/test-item-789.png');
      const otherCachePathMock = '/cache/path/test-item-789.png';
      const otherSkImageMock = { width: () => 300 } as SkImage;

      getCachePathAsyncMock.mockResolvedValueOnce(cachePathMock).mockResolvedValueOnce(otherCachePathMock);
      fromURIMock.mockResolvedValue(skDataMock);
      makeImageFromEncodedMock.mockReturnValueOnce(skImageMock).mockReturnValueOnce(otherSkImageMock);

      const { result, rerender } = renderHook<ReturnType<typeof useCachedSkiaImage>, { urlMock: typeof urlMock }>(
        ({ urlMock }) => useCachedSkiaImage(urlMock),
        {
          initialProps: { urlMock },
        },
      );

      // Wait for the first image to load
      await waitFor(() => expect(result.current.image).toBe(skImageMock));

      // Change the friendlyId
      rerender({ urlMock: otherUrlMock });

      // Should eventually get the second image
      await waitFor(() => expect(result.current.image).toBe(otherSkImageMock));

      expect(getCachePathAsyncMock).toHaveBeenCalledTimes(2);
      expect(makeImageFromEncodedMock).toHaveBeenCalledTimes(2);
    });
  });
});

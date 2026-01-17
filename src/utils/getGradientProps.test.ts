import { getGradientProps } from './getGradientProps';

describe('getGradientProps', () => {
  it('calculates gradient locations for a simple two-color gradient', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['red', 'blue'], times: [0, 100] as const },
    });

    expect(result.colors).toEqual(['red', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 100, y: 0 });
    expect(result.locations).toEqual([0, 1]);
  });

  it('calculates gradient locations for a three-color gradient', () => {
    const result = getGradientProps({
      direction: 'vertical',
      gradient: { colors: ['red', 'green', 'blue'], times: [0, 50, 100] as const },
    });

    expect(result.colors).toEqual(['red', 'green', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 0, y: 100 });
    expect(result.locations).toEqual([0, 0.5, 1]);
  });

  it('calculates gradient locations for evenly spaced colors', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['red', 'orange', 'yellow', 'green', 'blue'], times: [0, 25, 50, 75, 100] as const },
    });

    expect(result.colors).toEqual(['red', 'orange', 'yellow', 'green', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 100, y: 0 });
    expect(result.locations).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('calculates gradient locations for unevenly spaced colors', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['red', 'green', 'yellow', 'blue'], times: [0, 10, 90, 100] as const },
    });

    expect(result.colors).toEqual(['red', 'green', 'yellow', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 100, y: 0 });
    expect(result.locations).toEqual([0, 0.1, 0.9, 1]);
  });

  it('handles negative values correctly', () => {
    const result = getGradientProps({
      direction: 'vertical',
      gradient: { colors: ['red', 'orange', 'yellow', 'green', 'blue'], times: [-100, -50, 0, 50, 100] as const },
    });

    expect(result.colors).toEqual(['red', 'orange', 'yellow', 'green', 'blue']);
    expect(result.start).toEqual({ x: 0, y: -100 });
    expect(result.end).toEqual({ x: 0, y: 100 });
    expect(result.locations).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('handles floating point values correctly', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['red', 'green', 'yellow', 'blue'], times: [0, 33.33, 66.66, 100] as const },
    });

    expect(result.colors).toEqual(['red', 'green', 'yellow', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 100, y: 0 });
    expect(result.locations![0]).toBe(0);
    expect(result.locations![1]).toBeCloseTo(0.3333, 4);
    expect(result.locations![2]).toBeCloseTo(0.6666, 4);
    expect(result.locations![3]).toBe(1);
  });

  it('maintains the correct length of locations array', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['a', 'b', 'c', 'd', 'e', 'f'], times: [0, 10, 20, 30, 40, 50] as const },
    });

    expect(result.locations).toHaveLength(6);
  });

  it('handles very small intervals correctly', () => {
    const result = getGradientProps({
      direction: 'vertical',
      gradient: { colors: ['red', 'green', 'blue'], times: [0, 0.001, 0.002] as const },
    });

    expect(result.colors).toEqual(['red', 'green', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 0, y: 0.002 });
    expect(result.locations![0]).toBe(0);
    expect(result.locations![1]).toBe(0.5);
    expect(result.locations![2]).toBe(1);
  });

  it('handles very large intervals correctly', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['red', 'green', 'blue'], times: [0, 500000, 1000000] as const },
    });

    expect(result.colors).toEqual(['red', 'green', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 1000000, y: 0 });
    expect(result.locations).toEqual([0, 0.5, 1]);
  });

  it('uses default times [0, 1] when times parameter is omitted', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['red', 'blue'] },
    });

    expect(result.colors).toEqual(['red', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 1, y: 0 });
    expect(result.locations).toBeUndefined();
  });

  it('horizontal gradients always have y coordinates set to 0', () => {
    const result = getGradientProps({
      direction: 'horizontal',
      gradient: { colors: ['red', 'orange', 'yellow', 'green'], times: [-50, 0, 50, 100] as const },
    });

    expect(result.start.y).toBe(0);
    expect(result.end.y).toBe(0);
    expect(result.start.x).toBe(-50);
    expect(result.end.x).toBe(100);
  });

  it('vertical gradients always have x coordinates set to 0', () => {
    const result = getGradientProps({
      direction: 'vertical',
      gradient: { colors: ['red', 'orange', 'yellow', 'green'], times: [-50, 0, 50, 100] as const },
    });

    expect(result.start.x).toBe(0);
    expect(result.end.x).toBe(0);
    expect(result.start.y).toBe(-50);
    expect(result.end.y).toBe(100);
  });

  it('throws an error if times are not sorted in ascending order', () => {
    expect(() =>
      getGradientProps({
        direction: 'horizontal',
        gradient: { colors: ['red', 'green', 'blue'], times: [100, 0, 50] as const },
      }),
    ).toThrow('Gradient times must be in ascending order');
  });

  it('throws an error if times contain duplicate values', () => {
    expect(() =>
      getGradientProps({
        direction: 'horizontal',
        gradient: { colors: ['red', 'green', 'yellow', 'blue'], times: [0, 50, 50, 100] as const },
      }),
    ).toThrow('Gradient times must be unique values');
  });

  it('handles decimal precision correctly', () => {
    const result = getGradientProps({
      direction: 'vertical',
      gradient: { colors: ['red', 'green', 'yellow', 'blue'], times: [0, 1 / 3, 2 / 3, 1] as const },
    });

    expect(result.colors).toEqual(['red', 'green', 'yellow', 'blue']);
    expect(result.start).toEqual({ x: 0, y: 0 });
    expect(result.end).toEqual({ x: 0, y: 1 });
    expect(result.locations![0]).toBe(0);
    expect(result.locations![1]).toBeCloseTo(1 / 3, 10);
    expect(result.locations![2]).toBeCloseTo(2 / 3, 10);
    expect(result.locations![3]).toBe(1);
  });
});

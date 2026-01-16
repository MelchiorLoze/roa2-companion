import { gradientLocationsFromTimes } from './gradientLocationsFromTimes';

describe('gradientLocationsFromTimes', () => {
  it('calculates gradient locations for a simple two-color gradient', () => {
    const times = [0, 100] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(100);
    expect(result.locations).toEqual([0, 1]);
  });

  it('calculates gradient locations for a three-color gradient', () => {
    const times = [0, 50, 100] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(100);
    expect(result.locations).toEqual([0, 0.5, 1]);
  });

  it('calculates gradient locations for evenly spaced colors', () => {
    const times = [0, 25, 50, 75, 100] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(100);
    expect(result.locations).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('calculates gradient locations for unevenly spaced colors', () => {
    const times = [0, 10, 90, 100] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(100);
    expect(result.locations).toEqual([0, 0.1, 0.9, 1]);
  });

  it('handles negative values correctly', () => {
    const times = [-100, -50, 0, 50, 100] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(-100);
    expect(result.end).toBe(100);
    expect(result.locations).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('handles floating point values correctly', () => {
    const times = [0, 33.33, 66.66, 100] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(100);
    expect(result.locations[0]).toBe(0);
    expect(result.locations[1]).toBeCloseTo(0.3333, 4);
    expect(result.locations[2]).toBeCloseTo(0.6666, 4);
    expect(result.locations[3]).toBe(1);
  });

  it('maintains the correct length of locations array', () => {
    const times = [0, 10, 20, 30, 40, 50] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.locations).toHaveLength(6);
    expect(result.locations).toHaveLength(times.length);
  });

  it('returns readonly result object', () => {
    const times = [0, 50, 100] as const;
    const result = gradientLocationsFromTimes(times);

    // TypeScript type system enforces readonly, but we can verify the result is returned
    expect(result).toHaveProperty('start');
    expect(result).toHaveProperty('end');
    expect(result).toHaveProperty('locations');
  });

  it('handles very small intervals correctly', () => {
    const times = [0, 0.001, 0.002] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(0.002);
    expect(result.locations[0]).toBe(0);
    expect(result.locations[1]).toBe(0.5);
    expect(result.locations[2]).toBe(1);
  });

  it('handles very large intervals correctly', () => {
    const times = [0, 500000, 1000000] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(1000000);
    expect(result.locations).toEqual([0, 0.5, 1]);
  });

  it('preserves tuple type information', () => {
    const times = [0, 25, 50, 75, 100] as const;
    const result = gradientLocationsFromTimes(times);

    // Verify that locations has the same length as input
    expect(result.locations.length).toBe(times.length);
  });

  it('calculates locations where all first and last values are normalized to 0 and 1', () => {
    const times1 = [10, 20, 30] as const;
    const result1 = gradientLocationsFromTimes(times1);
    expect(result1.locations[0]).toBe(0);
    expect(result1.locations[result1.locations.length - 1]).toBe(1);

    const times2 = [-50, 0, 50] as const;
    const result2 = gradientLocationsFromTimes(times2);
    expect(result2.locations[0]).toBe(0);
    expect(result2.locations[result2.locations.length - 1]).toBe(1);

    const times3 = [100, 200] as const;
    const result3 = gradientLocationsFromTimes(times3);
    expect(result3.locations[0]).toBe(0);
    expect(result3.locations[result3.locations.length - 1]).toBe(1);
  });

  it('throws an error if times are not sorted in ascending order', () => {
    const times = [100, 0, 50] as const;
    expect(() => gradientLocationsFromTimes(times)).toThrow('Gradient times must be in ascending order');
  });

  it('throws an error if times contain duplicate values', () => {
    const times = [0, 50, 50, 100] as const;
    expect(() => gradientLocationsFromTimes(times)).toThrow('Gradient times must be unique values');
  });

  it('handles decimal precision correctly', () => {
    const times = [0, 1 / 3, 2 / 3, 1] as const;
    const result = gradientLocationsFromTimes(times);

    expect(result.start).toBe(0);
    expect(result.end).toBe(1);
    expect(result.locations[0]).toBe(0);
    expect(result.locations[1]).toBeCloseTo(1 / 3, 10);
    expect(result.locations[2]).toBeCloseTo(2 / 3, 10);
    expect(result.locations[3]).toBe(1);
  });
});

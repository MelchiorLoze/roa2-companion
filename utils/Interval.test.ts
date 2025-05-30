import { Interval } from './Interval';

describe('Interval', () => {
  it('throws an error if min is greater than max', () => {
    expect(() => new Interval(10, 5)).toThrow('Invalid interval: min cannot be greater than max');
  });

  it('creates an interval with given min and max', () => {
    const interval = new Interval(5, 10);
    expect(interval.min).toBe(5);
    expect(interval.max).toBe(10);
  });

  it('checks if a value is contained within the interval', () => {
    const interval = new Interval(5, 10);
    expect(interval.contains(7)).toBe(true);
    expect(interval.contains(4)).toBe(false);
    expect(interval.contains(11)).toBe(false);
  });

  it('calculates the size of the interval', () => {
    expect(new Interval(5, 10).size()).toBe(6);
    expect(new Interval(0, 0).size()).toBe(1);
    expect(new Interval(-5, 5).size()).toBe(11);
  });
});

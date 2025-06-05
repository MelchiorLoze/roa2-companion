export class Interval {
  public readonly min: number;
  public readonly max: number;

  constructor(min: number, max: number) {
    if (min > max) throw new Error('Invalid interval: min cannot be greater than max');

    this.min = min;
    this.max = max;
  }

  public contains(value: number): boolean {
    return this.min <= value && value <= this.max;
  }

  public size(): number {
    return this.max - this.min + 1; // +1 to include both ends
  }
}

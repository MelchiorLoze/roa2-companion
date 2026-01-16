type GradientLocationsResult<T extends readonly number[]> = Readonly<{
  start: number;
  end: number;
  locations: { [K in keyof T]: number };
}>;

export const gradientLocationsFromTimes = <T extends readonly number[]>(times: T): GradientLocationsResult<T> => {
  // Validate that times are in ascending order
  for (let i = 1; i < times.length; i++) {
    if (times[i] < times[i - 1]) throw new Error('Gradient times must be in ascending order');
    else if (times[i] === times[i - 1]) throw new Error('Gradient times must be unique values');
  }

  const start = times[0];
  const end = times[times.length - 1];
  const locations = times.map((pos) => (pos - start) / (end - start)) as GradientLocationsResult<T>['locations'];
  return { start, end, locations } as const;
};

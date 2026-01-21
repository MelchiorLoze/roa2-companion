export type LoadableState<T extends Record<string, unknown>> = Readonly<
  | (T & {
      isLoading: false;
      isError: false;
    })
  | (Record<keyof T, undefined> & {
      isLoading: true;
      isError: false;
    })
  | (Record<keyof T, undefined> & {
      isLoading: false;
      isError: true;
    })
>;

export type RefreshableState<T extends Record<string, unknown>> = LoadableState<T> &
  Readonly<{
    isRefreshing: boolean;
    refresh: () => void;
  }>;

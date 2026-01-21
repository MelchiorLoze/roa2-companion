export type LoadableState<TKey extends string, TData> = Readonly<
  | (Record<TKey, TData> & {
      isLoading: false;
      isError: false;
    })
  | (Record<TKey, undefined> & {
      isLoading: true;
      isError: false;
    })
  | (Record<TKey, undefined> & {
      isLoading: false;
      isError: true;
    })
>;

export type RefreshableState<TKey extends string, TData> = LoadableState<TKey, TData> &
  Readonly<{
    isRefreshing: boolean;
    refresh: () => void;
  }>;

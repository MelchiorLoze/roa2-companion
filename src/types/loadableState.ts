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

type BaseRefreshableState = Readonly<{
  isRefreshing: boolean;
  refresh: () => void;
}>;

export type RefreshableState<TKey extends string, TData> = LoadableState<TKey, TData> & BaseRefreshableState;

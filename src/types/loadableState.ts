export type LoadableState<
  TLoadable extends Record<string, unknown>,
  TStatic extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<
  | (TLoadable &
      TStatic & {
        isLoading: false;
        isError: false;
      })
  | (Record<keyof TLoadable, undefined> &
      TStatic & {
        isLoading: true;
        isError: false;
      })
  | (Record<keyof TLoadable, undefined> &
      TStatic & {
        isLoading: false;
        isError: true;
      })
>;

export type RefreshableState<
  TLoadable extends Record<string, unknown>,
  TStatic extends Record<string, unknown> = Record<string, unknown>,
> = LoadableState<
  TLoadable,
  TStatic & {
    isRefreshing: boolean;
    refresh: () => void;
  }
>;

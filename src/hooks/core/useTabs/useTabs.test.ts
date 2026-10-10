import { act, renderHook } from '@testing-library/react-native';

import { useTabs } from './useTabs';

describe('useTabs', () => {
  it('initializes with the first tab selected', async () => {
    const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

    expect(result.current.selectedTab).toBe('tab1');
  });

  it('creates tabs array with correct structure', async () => {
    const { result } = await renderHook(() => useTabs(['tab1', 'tab2'] as const));

    expect(result.current.tabs).toHaveLength(2);
    expect(result.current.tabs[0].label).toBe('tab1');
    expect(result.current.tabs[1].label).toBe('tab2');
    expect(typeof result.current.tabs[0].onPress).toBe('function');
    expect(typeof result.current.tabs[1].onPress).toBe('function');
  });

  it('switches to second tab when its onPress is called', async () => {
    const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

    expect(result.current.selectedTab).toBe('tab1');

    await act(result.current.tabs[1].onPress);

    expect(result.current.selectedTab).toBe('tab2');
  });

  it('switches to third tab when its onPress is called', async () => {
    const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

    expect(result.current.selectedTab).toBe('tab1');

    await act(result.current.tabs[2].onPress);

    expect(result.current.selectedTab).toBe('tab3');
  });

  it('switches back to first tab after selecting another tab', async () => {
    const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

    await act(result.current.tabs[1].onPress);

    expect(result.current.selectedTab).toBe('tab2');

    await act(result.current.tabs[0].onPress);

    expect(result.current.selectedTab).toBe('tab1');
  });

  it('handles multiple tab switches correctly', async () => {
    const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

    // tab1 -> tab2
    await act(result.current.tabs[1].onPress);
    expect(result.current.selectedTab).toBe('tab2');

    // tab2 -> tab3
    await act(result.current.tabs[2].onPress);
    expect(result.current.selectedTab).toBe('tab3');

    // tab3 -> tab1
    await act(result.current.tabs[0].onPress);
    expect(result.current.selectedTab).toBe('tab1');

    // tab1 -> tab3
    await act(result.current.tabs[2].onPress);
    expect(result.current.selectedTab).toBe('tab3');
  });

  it('works with two tabs', async () => {
    const { result } = await renderHook(() => useTabs(['active', 'inactive'] as const));

    expect(result.current.selectedTab).toBe('active');
    expect(result.current.tabs).toHaveLength(2);

    await act(result.current.tabs[1].onPress);

    expect(result.current.selectedTab).toBe('inactive');
  });

  it('works with single tab', async () => {
    const { result } = await renderHook(() => useTabs(['only'] as const));

    expect(result.current.selectedTab).toBe('only');
    expect(result.current.tabs).toHaveLength(1);

    // Pressing the only tab should not cause errors
    await act(result.current.tabs[0].onPress);

    expect(result.current.selectedTab).toBe('only');
  });

  describe('getValueForSelectedTab', () => {
    it('returns value for the first tab when it is selected', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

      const valuePerTab = {
        tab1: 'value1',
        tab2: 'value2',
        tab3: 'value3',
      };

      const value = result.current.getValueForSelectedTab(valuePerTab);

      expect(value).toBe('value1');
    });

    it('returns value for the second tab when it is selected', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

      await act(result.current.tabs[1].onPress);

      const valuePerTab = {
        tab1: 'value1',
        tab2: 'value2',
        tab3: 'value3',
      };

      const value = result.current.getValueForSelectedTab(valuePerTab);

      expect(value).toBe('value2');
    });

    it('returns value for the third tab when it is selected', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

      await act(result.current.tabs[2].onPress);

      const valuePerTab = {
        tab1: 'value1',
        tab2: 'value2',
        tab3: 'value3',
      };

      const value = result.current.getValueForSelectedTab(valuePerTab);

      expect(value).toBe('value3');
    });

    it('works with object values', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2'] as const));

      const valuePerTab = {
        tab1: { data: [1, 2, 3], isLoading: false },
        tab2: { data: [4, 5, 6], isLoading: true },
      };

      expect(result.current.getValueForSelectedTab(valuePerTab)).toEqual({
        data: [1, 2, 3],
        isLoading: false,
      });

      await act(result.current.tabs[1].onPress);

      expect(result.current.getValueForSelectedTab(valuePerTab)).toEqual({
        data: [4, 5, 6],
        isLoading: true,
      });
    });

    it('works with number values', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2'] as const));

      const valuePerTab = {
        tab1: 100,
        tab2: 200,
      };

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe(100);

      await act(result.current.tabs[1].onPress);

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe(200);
    });

    it('works with boolean values', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2'] as const));

      const valuePerTab = {
        tab1: true,
        tab2: false,
      };

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe(true);

      await act(result.current.tabs[1].onPress);

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe(false);
    });

    it('works with null and undefined values', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

      const valuePerTab = {
        tab1: null,
        tab2: undefined,
        tab3: 'value',
      };

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe(null);

      await act(result.current.tabs[1].onPress);

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe(undefined);

      await act(result.current.tabs[2].onPress);

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe('value');
    });

    it('returns correct value after multiple tab switches', async () => {
      const { result } = await renderHook(() => useTabs(['tab1', 'tab2', 'tab3'] as const));

      const valuePerTab = {
        tab1: 'A',
        tab2: 'B',
        tab3: 'C',
      };

      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe('A');

      await act(result.current.tabs[1].onPress);
      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe('B');

      await act(result.current.tabs[2].onPress);
      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe('C');

      await act(result.current.tabs[0].onPress);
      expect(result.current.getValueForSelectedTab(valuePerTab)).toBe('A');
    });
  });
});

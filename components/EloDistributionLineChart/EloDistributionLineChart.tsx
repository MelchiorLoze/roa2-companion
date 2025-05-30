import { StyleProp, View, ViewStyle } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { useLeaderboardStats } from '@/hooks/business/useLeaderboardStats/useLeaderboardStats';

type Props = {
  width: number;
  style?: StyleProp<ViewStyle>;
};

export const EloDistributionLineChart = ({ width, style }: Props) => {
  const { eloDistribution, isLoading: isLoadingLeaderboard } = useLeaderboardStats();

  if (isLoadingLeaderboard) return null;

  return (
    <View style={style} testID="elo-distribution">
      <LineChart
        adjustToWidth
        data={eloDistribution}
        dataPointsColor="transparent"
        dataPointsRadius={2}
        disableScroll
        height={width}
        hideAxesAndRules
        initialSpacing={0}
        thickness={1}
        width={width}
        xAxisLabelsHeight={0}
        yAxisLabelWidth={0}
      />
    </View>
  );
};

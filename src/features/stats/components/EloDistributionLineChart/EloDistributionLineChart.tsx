import { type StyleProp, View, type ViewStyle } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { useLeaderboardStats } from '../../hooks/business/useLeaderboardStats/useLeaderboardStats';

type Props = {
  userElo: number;
  width: number;
  style?: StyleProp<ViewStyle>;
};

export const EloDistributionLineChart = ({ userElo, width, style }: Props) => {
  const { eloDistribution, isLoading: isLoadingLeaderboard } = useLeaderboardStats(userElo);

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

import { type StyleProp, View, type ViewStyle } from 'react-native';
import { LineChart, type lineDataItem } from 'react-native-gifted-charts';

import { useEloDistribution } from '../../../hooks/business/useEloDistribution/useEloDistribution';

const formatLineData = (eloDistribution: Record<number, number>) =>
  Object.values(eloDistribution).map(
    (count): lineDataItem => ({
      value: count,
    }),
  );

type Props = {
  userElo: number;
  width: number;
  style?: StyleProp<ViewStyle>;
};

export const EloDistributionLineChart = ({ userElo, width, style }: Readonly<Props>) => {
  const { eloDistribution, roundElo, isLoading: isLoadingLeaderboard } = useEloDistribution();

  if (isLoadingLeaderboard) return null;

  const userEloStep = roundElo(userElo);
  const userEloStepIndex = Object.keys(eloDistribution).findIndex((elo) => Number(elo) === userEloStep);
  const lineData = formatLineData(eloDistribution);
  if (userEloStepIndex !== -1) {
    lineData[userEloStepIndex].dataPointColor = 'red';
    lineData[userEloStepIndex].dataPointRadius = 2;
  }

  return (
    <View style={style} testID="elo-distribution">
      <LineChart
        adjustToWidth
        data={lineData}
        dataPointsColor="transparent"
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

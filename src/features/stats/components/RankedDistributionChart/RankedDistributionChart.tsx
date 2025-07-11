import { useWindowDimensions, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { EloDistributionLineChart } from './EloDistributionLineChart/EloDistributionLineChart';
import { RankDistributionBarChart } from './RankDistributionBarChart/RankDistributionBarChart';

type Props = {
  elo?: number;
};

export const RankedDistributionChart = ({ elo }: Readonly<Props>) => {
  const dimensions = useWindowDimensions();
  const width = dimensions.width - 2 * 24;

  return (
    <View>
      <RankDistributionBarChart width={width} />
      <EloDistributionLineChart style={styles.lineChartContainer} userElo={elo} width={width} />
    </View>
  );
};

const styles = StyleSheet.create({
  lineChartContainer: {
    position: 'absolute',
  },
});

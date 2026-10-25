import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { EloDistributionLineChart } from './EloDistributionLineChart/EloDistributionLineChart';
import { RankDistributionBarChart } from './RankDistributionBarChart/RankDistributionBarChart';

type Props = {
  elo?: number;
};

export const RankedDistributionChart = ({ elo }: Readonly<Props>) => {
  const [width, setWidth] = useState(0);

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <RankDistributionBarChart width={width} />
      <EloDistributionLineChart style={StyleSheet.absoluteFill} userElo={elo} width={width} />
    </View>
  );
};

import {View, Text} from 'react-native';
import {Icons} from '../../../../assets/icons';

const ExploreStatesSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          EXPLORE STATES
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
    </View>
  );
};

export default ExploreStatesSection;

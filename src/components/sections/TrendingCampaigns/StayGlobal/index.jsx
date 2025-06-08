import {View, Text} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';

const StayGlobalSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          STAY GLOBAL. PAY NOTHING
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
    </View>
  );
};

export default StayGlobalSection;

import React from 'react';
import {Text, View} from 'react-native';

const PayoutMethodScreen = () => {
  return (
    <View className="flex-1 flex-col gap-4 bg-white p-5">
      <Text>PayoutMethodMinimum amount must be ₹100</Text>
    </View>
  );
};

export default PayoutMethodScreen;

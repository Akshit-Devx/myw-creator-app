import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../components/layouts/TopNav';

const AnalyticsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <TopNav />
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold mt-150 text-center">
          Comming Soon
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

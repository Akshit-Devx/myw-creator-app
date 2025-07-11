import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../components/layouts/TopNav';

const LinkInBioScreen = () => {
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

export default LinkInBioScreen;

import {View, Text, Image} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';
import {getBrandMediaURL} from '../../../../utility/helper';

const RelaxAndRechargeSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          RELAX & RECHARGE
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <View className="flex-row items-start gap-4 w-full">
        <View className="flex-1 py-5 border border-gray-200 rounded-lg flex-col gap-1 items-center justify-center">
          <Image
            source={{
              uri: getBrandMediaURL('public/static-assets/salons.jpg'),
            }}
            className="w-20 h-20 rounded-full"
          />
          <Text>Salons</Text>
        </View>
        <View className="flex-1 py-5 border border-gray-200 rounded-lg flex-col gap-1 items-center justify-center">
          <Image
            source={{
              uri: getBrandMediaURL('public/static-assets/restaurants.jpg'),
            }}
            className="w-20 h-20 rounded-full"
          />
          <Text>Restaurants</Text>
        </View>
        <View className="flex-1 py-5 border border-gray-200 rounded-lg flex-col gap-1 items-center justify-center">
          <Image
            source={{
              uri: getBrandMediaURL('public/static-assets/resorts.jpg'),
            }}
            className="w-20 h-20 rounded-full"
          />
          <Text>Resorts</Text>
        </View>
      </View>
    </View>
  );
};

export default RelaxAndRechargeSection;

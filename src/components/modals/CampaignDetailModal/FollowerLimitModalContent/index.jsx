import {View, Text} from 'react-native';
import React from 'react';
import Button from '../../../elements/Button';
import { Icons } from '../../../../assets/icons';

const FollowerLimitModalContent = ({handleSubscribeNow}) => {
  return (
    <View className="flex-col gap-4 justify-center items-center">
      <View className="w-[80] h-[80] bg-[#FFFFFF] rounded-full items-center justify-center mt-[-55]">
        <View className="w-[70] h-[70] bg-[#F2F3F7] rounded-full items-center justify-center">
          <Icons.SubscriptionsModalIcon width={40} height={40} />
        </View>
      </View>
      <Text className="text-xl font-semibold text-gray-900">Hey there!</Text>
      <Text className="text-md text-center font-normal text-gray-600 px-4 tracking-wide">
        You're below our follower limit, so opportunities are limited for now.
        Subscribe and use our builder to grow and unlock campaigns!
      </Text>
      <Button
        title="Subscribe Now"
        onPress={handleSubscribeNow}
        className="mt-4 w-full"
      />
    </View>
  );
};

export default FollowerLimitModalContent;

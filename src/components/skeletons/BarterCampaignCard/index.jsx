import {View} from 'react-native';
import React from 'react';
import {useSkeletonAnimation} from '../../../hooks/useSkeletonAnimation';

const BarterCampaignCardSkeleton = () => {
  const {opacity, AnimatedView} = useSkeletonAnimation();

  return (
    <View className="relative rounded-xl overflow-hidden border border-gray-200">
      <AnimatedView className="w-full h-[300px] bg-gray-50" style={{opacity}} />
      <View className="absolute top-2 left-2 rounded-xl overflow-hidden">
        <AnimatedView className="w-20 h-[30px] bg-gray-200" style={{opacity}} />
        <AnimatedView
          className="w-20 h-[50px] bg-gray-200 mt-0.5"
          style={{opacity}}
        />
      </View>
      <AnimatedView
        className="absolute bottom-[72px] left-2 w-20 h-[30px] bg-gray-200 rounded-full"
        style={{opacity}}
      />
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 py-3 px-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <AnimatedView
            className="w-14 h-14 rounded-full bg-gray-200"
            style={{opacity}}
          />
          <View className="flex-col gap-2">
            <AnimatedView
              className="w-[180px] h-6 bg-gray-200"
              style={{opacity}}
            />
            <AnimatedView
              className="w-[140px] h-5 bg-gray-200"
              style={{opacity}}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default BarterCampaignCardSkeleton;

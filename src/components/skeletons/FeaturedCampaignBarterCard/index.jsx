import React from 'react';
import {View} from 'react-native';
import {useSkeletonAnimation} from '../../../hooks/useSkeletonAnimation';

const FeaturedCampaignBarterCardSkeleton = () => {
  const {opacity, AnimatedView} = useSkeletonAnimation();

  return (
    <View className="relative rounded-xl overflow-hidden border border-gray-200">
      <AnimatedView
        className="w-[280px] h-[400px] bg-gray-50"
        style={{opacity}}
      />
      <AnimatedView
        className="absolute top-2 left-2 w-20 h-[30px] bg-gray-200 rounded-full"
        style={{opacity}}
      />
      <View className="absolute bottom-0 left-0 border-t border-gray-200 right-0 py-3 px-3 flex-row items-center justify-between">
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

export default FeaturedCampaignBarterCardSkeleton;

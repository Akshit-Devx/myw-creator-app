import React from 'react';
import {View} from 'react-native';
import {useSkeletonAnimation} from '../../../hooks/useSkeletonAnimation';

const FeaturedCampaignOfferCardSkeleton = () => {
  const {opacity, AnimatedView} = useSkeletonAnimation();

  return (
    <View className="relative rounded-xl overflow-hidden border border-gray-200">
      <AnimatedView
        className="w-[340px] h-[200px] bg-gray-50"
        style={{opacity}}
      />
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 py-2 px-2 flex-row items-center justify-between">
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
        <AnimatedView
          className="w-[60px] h-6 bg-gray-200 rounded-full"
          style={{opacity}}
        />
      </View>
    </View>
  );
};

export default FeaturedCampaignOfferCardSkeleton;

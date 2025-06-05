import {View, Text, Image} from 'react-native';
import React from 'react';
import {
  getBrandMediaURL,
  getMaxOfferPercentage,
  getMediaTypeFromPath,
} from '../../../utility/helper';
import Video from 'react-native-video';

const FeaturedCampaignOfferCard = ({campaign}) => {
  const mediaType = getMediaTypeFromPath(campaign.banner);
  return (
    <View className="relative rounded-xl overflow-hidden">
      {mediaType === 'video' ? (
        <Video
          source={{uri: getBrandMediaURL(campaign.banner)}}
          style={{width: 340, height: 200}}
          resizeMode="cover"
          repeat
          muted
          paused={false}
          controls={false}
          playInBackground={false}
          playWhenInactive={false}
        />
      ) : (
        <Image
          source={{uri: getBrandMediaURL(campaign.banner)}}
          style={{width: 340, height: 200, objectFit: 'cover'}}
        />
      )}
      <View className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={{uri: getBrandMediaURL(campaign?.brandLogo)}}
            className="w-14 h-14 rounded-full"
          />
          <View className="flex-col gap-0.5">
            <Text
              className="text-white text-xl font-semibold w-48"
              numberOfLines={1}>
              {campaign.name}
            </Text>
            <Text className="text-white text-md w-48" numberOfLines={1}>
              {campaign?.storeData?.city}, {campaign?.storeData?.state}
            </Text>
          </View>
        </View>
        <Text className="text-white font-bold text-md bg-[#f90] px-2 py-1 rounded-full">
          {getMaxOfferPercentage(campaign.requirements)}% Off
        </Text>
      </View>
    </View>
  );
};

export default FeaturedCampaignOfferCard;

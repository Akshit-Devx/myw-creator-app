import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import {
  getMediaURL,
  getMaxOfferPercentage,
  getMediaTypeFromPath,
} from '../../../utility/helper';

const FeaturedCampaignOfferCard = ({campaign}) => {
  const navigation = useNavigation();
  const mediaType = getMediaTypeFromPath(campaign.banner);
  return (
    <TouchableOpacity
      className="relative rounded-xl overflow-hidden"
      onPress={() =>
        navigation.navigate('Detail', {
          screen: 'CampaignDetails',
          params: {
            campaignId: campaign.id,
            storeId: campaign?.storeData?.id,
          },
        })
      }>
      {mediaType === 'video' ? (
        <Video
          source={{uri: getMediaURL(campaign.banner)}}
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
          source={{uri: getMediaURL(campaign.banner)}}
          style={{width: 340, height: 200, objectFit: 'cover'}}
        />
      )}
      <View className="absolute bottom-0 left-0 right-0 bg-black/70 py-2 px-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={{uri: getMediaURL(campaign?.brandLogo)}}
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
    </TouchableOpacity>
  );
};

export default FeaturedCampaignOfferCard;

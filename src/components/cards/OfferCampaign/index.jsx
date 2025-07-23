import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import {
  formatNumber,
  getMediaURL,
  getLowestMinFollowers,
  getMaxOfferPercentage,
  getMaxUptoAmount,
  getMediaTypeFromPath,
} from '../../../utility/helper';
import {useNavigation} from '@react-navigation/native';

const OfferCampaignCard = ({campaign}) => {
  const navigation = useNavigation();
  const mediaType = getMediaTypeFromPath(campaign?.banner);
  const maxUptoAmount = getMaxUptoAmount(campaign?.requirements);

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
      <Text className="absolute top-0 left-0 text-white font-bold text-md bg-[#f90] px-2 py-1 rounded-br-lg">
        {getMaxOfferPercentage(campaign.requirements)}% Off
      </Text>

      <Text className="absolute bottom-[105px] left-0 text-white font-bold text-md bg-blue-600 px-2 py-1">
        {maxUptoAmount > 0 && `On Services Upto ₹${maxUptoAmount}`}
        {maxUptoAmount <= 0 && `All Services`}
      </Text>

      <View className="py-3 px-3 flex-col gap-2">
        <Text className="bg-blue-50 py-1.5 px-3 rounded-full font-semibold self-start">
          {formatNumber(getLowestMinFollowers(campaign.requirements) || 0)}+
        </Text>
        <View className="flex-row items-center gap-3">
          <Image
            source={{uri: getMediaURL(campaign?.brandLogo)}}
            className="w-14 h-14 rounded-full border border-gray-100"
          />
          <View className="flex-col gap-0.5">
            <Text
              className="text-black text-xl font-semibold w-48"
              numberOfLines={1}>
              {campaign.name}
            </Text>
            <Text className="text-black text-md w-48" numberOfLines={1}>
              {campaign?.storeData?.city}, {campaign?.storeData?.state}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OfferCampaignCard;

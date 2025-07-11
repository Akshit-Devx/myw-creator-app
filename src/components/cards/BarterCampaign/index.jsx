import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  formatNumber,
  getBrandMediaURL,
  getLowestMinFollowers,
  getMaxUptoAmount,
  getMediaTypeFromPath,
} from '../../../utility/helper';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import {Icons} from '../../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';

const BarterCampaignCard = ({campaign}) => {
  const navigation = useNavigation();
  const mediaType = getMediaTypeFromPath(campaign?.banner);
  const maxUptoAmount = getMaxUptoAmount(campaign?.requirements);

  const CAMPAIGN_OFFERING = category => {
    switch (category) {
      case 'RESTAURANTS':
        return 'Meals & Drinks';
      case 'RESORTS':
        return 'Stays';
      default:
        return 'All Services';
    }
  };

  return (
    <TouchableOpacity
      className="relative rounded-xl overflow-hidden bg-white"
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
          source={{uri: getBrandMediaURL(campaign.banner)}}
          style={{width: 340, height: 250}}
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
          style={{width: 340, height: 250, objectFit: 'cover'}}
        />
      )}
      <View className="absolute top-2 left-2 rounded-xl overflow-hidden">
        <Text className="bg-[#0033e6] text-white text-lg py-1 px-2 font-medium text-center">
          FREE
        </Text>
        {maxUptoAmount > 0 && (
          <View className="flex-col items-center justify-center gap-0.5 bg-white py-1 px-2">
            <Text className="text-gray-500 text-xs text-center">
              Services Upto
            </Text>
            <Text className="text-black text-md text-center">
              ₹ {maxUptoAmount}
            </Text>
          </View>
        )}
        {maxUptoAmount <= 0 && (
          <Text className="text-black bg-white text-md text-center px-2 py-1">
            {CAMPAIGN_OFFERING(campaign.category)}
          </Text>
        )}
      </View>
      <View className="absolute bottom-[70px] left-2 bg-white py-1.5 px-3 rounded-full flex-row items-center ">
        <Icons.Instagram height={15} width={15} />
        <Text className="left-1 bg-white rounded-full font-semibold">
          {formatNumber(getLowestMinFollowers(campaign.requirements) || 0)}+
        </Text>
      </View>
      <LinearGradient
        colors={['transparent', 'black']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <View className="absolute bottom-0 left-0 right-0  py-3 px-3 flex-row items-center justify-between">
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
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default BarterCampaignCard;

import {useMemo} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {Icons} from '../../../assets/icons';
import {
  getMediaURL,
  formatNumber,
  getMediaTypeFromPath,
  getLowestMinFollowers,
} from '../../../utility/helper';

const FeaturedCampaignBarterCard = ({campaign, cards = []}) => {
  const navigation = useNavigation();
  const mediaType = getMediaTypeFromPath(campaign.banner);

  const isProductCampaign = useMemo(() => {
    return cards?.some(card => card?.campaign?.category === 'PRODUCTS');
  }, [cards]);

  const creatorTypes = campaign?.requirements?.[0]?.creatorType || [];

  const maxUptoAmount = creatorTypes.length
    ? Math.max(...creatorTypes.map(ct => ct.uptoAmount || 0))
    : 0;

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
          style={{width: 280, height: 400}}
          resizeMode="cover"
          repeat
          muted
          paused={false}
          controls={false}
          playInBackground={false}
          playWhenInactive={false}
        />
      ) : (
        <FastImage
          source={{uri: getMediaURL(campaign.banner)}}
          style={{width: 280, height: 400, objectFit: 'cover'}}
        />
      )}
      <View className="absolute bg-white py-1.5 px-3 rounded-full top-2 left-2 flex-row items-center gap-1">
        <Icons.IgFillIcon width={18} height={18} />
        <Text className="font-semibold">
          {formatNumber(getLowestMinFollowers(campaign.requirements) || 0)}+
        </Text>
      </View>
      <LinearGradient
        colors={['#00145b', '#073DFFC7', '#5B7FFF7A', '#7594FF00']}
        locations={[0, 0.74, 0.895, 1]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <View className="">
          <View className="flex-row p-4 items-center gap-3 border-b border-gray-500">
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
              <View className="flex-row items-center gap-1">
                {isProductCampaign ? null : (
                  <Icons.PinLocationIcon
                    width={12}
                    height={12}
                    fill={'#FFFFFF'}
                  />
                )}
                {isProductCampaign ? (
                  <Text className="text-white text-md w-48" numberOfLines={1}>
                    {campaign?.storeData?.website}
                  </Text>
                ) : (
                  <Text className="text-white text-md w-48" numberOfLines={1}>
                    {campaign?.storeData?.city}, {campaign?.storeData?.state}
                  </Text>
                )}
              </View>
            </View>
          </View>
          {campaign?.type === 'BARTER' && maxUptoAmount > 0 && (
            <View className="p-4">
              <Text className="text-xs text-white font-semibold">
                {`GET ${isProductCampaign ? 'PRODUCTS' : 'SERVICES'}`}
              </Text>
              <Text className="text-md text-white font-semibold">
                {`Free up to ₹${maxUptoAmount}`}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default FeaturedCampaignBarterCard;

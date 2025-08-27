import {useMemo} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {Icons} from '../../../assets/icons';
import {AutoApprovalSVG, FastApprovalSVG} from '../../../utility/icons';
import {
  formatNumber,
  getMediaURL,
  getMaxUptoAmount,
  getMediaTypeFromPath,
  getLowestMinFollowers,
} from '../../../utility/helper';

const BarterCampaignCard = ({campaign, store}) => {
  const navigation = useNavigation();
  const mediaType = getMediaTypeFromPath(campaign?.banner);
  const maxUptoAmount = getMaxUptoAmount(campaign?.requirements);
  const storeData = store ? store : campaign?.storeData;
  const creatorTypes = useMemo(
    () => campaign?.requirements?.[0]?.creatorType || [],
    [campaign],
  );

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

  const isProduct = useMemo(() => {
    return campaign?.category === 'PRODUCTS';
  }, [campaign?.category]);

  const hasAutoApproval = useMemo(() => {
    return creatorTypes[0]?.autoRequestApproval;
  }, [creatorTypes]);

  const hasFastApproval = useMemo(() => {
    return campaign?.hasFastApproval;
  }, [campaign]);

  return (
    <TouchableOpacity
      className="relative rounded-xl overflow-hidden"
      onPress={() =>
        navigation.navigate('Detail', {
          screen: 'CampaignDetails',
          params: {
            campaignId: campaign.id,
            storeId: storeData?.id,
          },
        })
      }>
      {mediaType === 'video' ? (
        <Video
          source={{uri: getMediaURL(campaign.banner)}}
          style={{width: '100%', height: 250}}
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
          style={{width: '100%', height: 250, objectFit: 'cover'}}
        />
      )}
      <LinearGradient
        colors={['#00000000', '#00000000', '#000000', '#000000']}
        locations={[0, 0.5058, 0.8574, 1]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={{...StyleSheet.absoluteFillObject}} // Adjust style as needed
      />
      <View className="absolute top-2 left-2 rounded-xl overflow-hidden">
        <LinearGradient
          colors={['#9c2cf3', '#1a47e8']}
          locations={[0, 1]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={{flex: 1}} // Adjust style as needed
        >
          <Text className="text-white text-md py-2 px-2 font-medium text-center">
            {isProduct ? 'GET PRODUCT' : 'FREE'}
          </Text>
        </LinearGradient>
        {maxUptoAmount > 0 && (
          <View className="flex-col items-center justify-center gap-0.5 bg-white py-1 px-2">
            <Text className="text-gray-500 text-xs text-center">Upto</Text>
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
      <View className="absolute right-4 top-4">
        {hasAutoApproval && (
          <View className="bg-[#0000009e] p-1 rounded-full flex-row items-center gap-2">
            <AutoApprovalSVG />
            <Text className="text-white text-xs">Instant Approval</Text>
          </View>
        )}
        {hasFastApproval && (
          <View className="bg-[#0000009e] p-1 rounded-full flex-row items-center gap-2">
            <FastApprovalSVG />
            <Text className="text-white text-xs">Fast Approval</Text>
          </View>
        )}
      </View>
      <View className="absolute bottom-[70px] left-2 bg-white py-1 px-2 rounded-full flex-row items-center gap-2">
        <Icons.IgFillIcon width={16} height={16} />
        <Text className="font-normal text-gray-600">
          {formatNumber(getLowestMinFollowers(campaign.requirements) || 0)}+
        </Text>
      </View>
      <View className="absolute bottom-0 left-0 right-0 py-3 px-3 flex-row items-center justify-between">
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
            {isProduct && storeData?.website ? <View className="flex-row items-center gap-1">
              <Icons.PinLocationIcon width={12} height={12} fill={'#FFFFFF'} />
              <Text className="text-blue-600 text-md w-48" numberOfLines={1}>
                {storeData?.website}
              </Text>
            </View> : storeData?.city && storeData?.state ? <View className="flex-row items-center gap-1">
              <Icons.PinLocationIcon width={12} height={12} fill={'#FFFFFF'} />
              <Text className="text-white text-md w-48" numberOfLines={1}>
                {storeData?.city}, {storeData?.state}
              </Text>
            </View> : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BarterCampaignCard;

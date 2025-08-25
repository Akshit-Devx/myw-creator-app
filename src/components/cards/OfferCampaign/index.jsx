import { useMemo } from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  getMediaURL,
  formatNumber,
  getMaxUptoAmount,
  getMediaTypeFromPath,
  getLowestMinFollowers,
  getMaxOfferPercentage,
} from '../../../utility/helper';
import {Icons} from '../../../assets/icons';
import {AutoApprovalSVG, FastApprovalSVG} from '../../../utility/icons';

const OfferCampaignCard = ({campaign, store}) => {
  const navigation = useNavigation();
  const mediaType = getMediaTypeFromPath(campaign?.banner);
  const maxUptoAmount = getMaxUptoAmount(campaign?.requirements);
  const storeData = store ? store : campaign?.storeData;

  const creatorTypes = useMemo(() => {
    return campaign?.requirements?.[0]?.creatorType || [];
  }, [campaign]);

  const hasAutoApproval = useMemo(() => {
    return creatorTypes[0]?.autoRequestApproval;
  }, [creatorTypes]);

  const hasFastApproval = useMemo(() => {
    return campaign?.hasFastApproval;
  }, [campaign?.hasFastApproval]);

  return (
    <TouchableOpacity
      className="relative rounded-xl overflow-hidden border border-gray-200"
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
          source={{
            uri: getMediaURL(campaign.banner),
          }}
          style={{width: '100%', height: 200}}
          resizeMode="cover"
          repeat
          muted
          controls={false}
          onError={error =>
            console.error('Video Error:', JSON.stringify(error, null, 2))
          }
        />
      ) : (
        <Image
          source={{uri: getMediaURL(campaign.banner)}}
          style={{width: '100%', height: 200, objectFit: 'cover'}}
        />
      )}
      <Text className="absolute top-0 left-0 text-white font-bold text-md bg-[#f90] px-2 py-1 rounded-br-lg">
        {getMaxOfferPercentage(campaign.requirements)}% Off
      </Text>
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
      <LinearGradient
        colors={['#00145b', '#073DFFC7', '#5B7FFF7A', '#7594FF00']}
        locations={[0, 0.74, 0.895, 1]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{position: 'absolute', bottom: 105, left: 0, right: 0}}>
        <Text className="text-white font-bold text-md px-2 py-1">
          {maxUptoAmount > 0 && `On Services Upto ₹${maxUptoAmount}`}
          {maxUptoAmount <= 0 && 'All Services'}
        </Text>
      </LinearGradient>

      <View className="py-3 px-3 flex-col gap-2">
        <View className="flex-row items-center bg-blue-50 py-2 px-3 gap-2 self-start rounded-full">
          <Icons.IgFillIcon width={18} height={18} />
          <Text className="font-semibold text-gray-500">
            {formatNumber(getLowestMinFollowers(campaign.requirements) || 0)}+
          </Text>
        </View>
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
            <View className="flex-row items-center gap-1">
              <Icons.PinLocationIcon width={12} height={12} fill={'#798da5'} />
              <Text
                className="text-gray-500 font-semibold text-md w-48"
                numberOfLines={1}>
                {storeData?.city}, {storeData?.state}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OfferCampaignCard;

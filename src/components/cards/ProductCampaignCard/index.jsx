import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {PNGs} from '../../../assets/png';
import {Icons} from '../../../assets/icons';
import {formatNumber, getMediaURL} from '../../../utility/helper';
import {ArrowSVG, FastApprovalSVG, LinkGlobeSVG} from '../../../utility/icons';

const PlatformIcon = React.memo(({platform, followers}) => {
  return (
    <View className="flex-row gap-1 items-center">
      {platform === 'INSTAGRAM' ? (
        <Icons.IgFillIcon width={18} height={18} />
      ) : (
        <Icons.YoutubeIcon width={18} height={18} />
      )}
      <Text className="text-sm text-gray-600 font-semibold">{followers}</Text>
    </View>
  );
});

const MediaDisplay = React.memo(({src}) => {
  return (
    <Image
      source={src ? {uri: src} : PNGs.DummyBanner}
      className="w-10 h-10 rounded-full"
      resizeMode="cover"
    />
  );
});

const ProductCampaignCard = ({campaign, store}) => {
  const navigation = useNavigation();
  const creatorTypes = useMemo(() => {
    return campaign?.requirements?.[0]?.creatorType || [];
  }, [campaign?.requirements]);
  const minFollowersByPlatform = useMemo(() => {
    return campaign?.requirements?.map(item => ({
      platform: item.platform,
      followers: formatNumber(
        item.creatorType?.length
          ? Math.min(...item?.creatorType.map(ct => ct.minFollowers || 0))
          : 0,
      ),
    }));
  }, [campaign?.requirements]);

  const maxUptoAmount = useMemo(() => {
    return creatorTypes.length
      ? Math.max(...creatorTypes.map(ct => ct.uptoAmount || 0))
      : 0;
  }, [creatorTypes]);

  const hasFastApproval = useMemo(() => {
    return campaign?.hasFastApproval;
  }, [campaign?.hasFastApproval]);

  const allOfferings = useMemo(() => {
    return (campaign?.requirements || [])
      .flatMap(req => req.creatorType || [])
      .flatMap(ct => ct.offerings || []);
  }, [campaign?.requirements]);

  const visibleOfferings = allOfferings.slice(0, 2);
  const extraCount = allOfferings.length - visibleOfferings.length;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Detail', {
          screen: 'CampaignDetails',
          params: {
            campaignId: campaign.id,
            storeId: store?.id,
          },
        })
      }
      className="rounded-xl overflow-hidden bg-white border border-gray-200 p-2 flex-col gap-3">
      <View className="relative w-full h-[220] rounded-xl overflow-hidden">
        <FastImage
          source={{uri: getMediaURL(campaign.banner)}}
          style={{width: '100%', height: '100%'}}
        />
        <LinearGradient
          colors={['#00000000', '#00000000', '#000000', '#000000']}
          locations={[0, 0.5058, 0.8574, 1]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={{...StyleSheet.absoluteFillObject}} // Adjust style as needed
        />
        {allOfferings.length > 0 && allOfferings[0]?.type !== 'ANY_SERVICE' && (
          <View className="absolute left-3 bottom-10 z-20 flex-row items-center shadow-lg">
            {visibleOfferings.map((offering, idx) => (
              <View
                className={`w-10 h-10 rounded-full overflow-hidden border border-white bg-gray-200 items-center justify-center relative shadow-sm ${
                  idx > 0 ? '-ml-4.5' : ''
                }`}
                key={offering.id || idx}>
                <MediaDisplay src={offering.media?.[0]?.link[0]} alt="logo" />
              </View>
            ))}
            {extraCount > 0 && (
              <View
                className={`w-10 h-10 rounded-full overflow-hidden border border-white items-center justify-center relative shadow-sm bg-blue-50 ${
                  visibleOfferings.length > 0 ? '-ml-4.5' : ''
                }`}>
                <Text className="text-blue-700 font-bold text-xs text-center">
                  +{extraCount}
                </Text>
              </View>
            )}
          </View>
        )}
        <Text className="absolute bottom-3 left-3 font-semibold text-white">
          {maxUptoAmount > 0
            ? `Any product upto ₹${formatNumber(maxUptoAmount)}`
            : 'All Products'}
        </Text>
      </View>
      <View className="flex-col gap-2 px-2">
        <View className="flex-row gap-5">
          {minFollowersByPlatform?.map((item, index) => {
            return (
              <PlatformIcon
                platform={item.platform}
                followers={item.followers}
                key={`${item.platform}-${index}`}
              />
            );
          })}
          {hasFastApproval && <Text className="">|</Text>}
          {hasFastApproval && (
            <View className="flex-row items-center gap-1">
              <FastApprovalSVG color="#0033E6E5" />
              <Text>Fast Approval</Text>
            </View>
          )}
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row items-center gap-3">
            <FastImage
              source={{uri: getMediaURL(campaign.brandLogo)}}
              style={{
                width: 44,
                height: 44,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: '#DDD',
              }}
            />
            <View>
              <Text className=" text-lg text-gray-700 font-semibold">
                {store?.name}
              </Text>
              {store?.website && (
                <View className="flex-row items-center gap-1">
                  <LinkGlobeSVG />
                  <Text className="text-gray-600 font-semibold">
                    {store?.website}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className="w-8 h-8 rounded-full bg-gray-800 items-center justify-center">
            <ArrowSVG size={16} color="#ffffff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCampaignCard;

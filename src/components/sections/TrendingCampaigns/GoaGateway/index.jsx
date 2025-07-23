import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import {Icons} from '../../../../assets/icons';
import {getCampaignByIdAPI} from '../../../../services/handleApi';
import {
  formatNumber,
  getMediaURL,
  getLowestMinFollowers,
  getMediaTypeFromPath,
} from '../../../../utility/helper';
import Video from 'react-native-video';

const goaList = [
  '1e8688f4-42a7-4cb5-bbfb-1a693c8b150d',
  'e14d264a-949f-44cf-bfa3-6a1c0596ebc7',
  '238a7c02-875f-444e-a4b9-db49b4baa1ef',
  '0d6377c1-f3dd-42e0-968c-0e57b8a392ce',
  'ec38f092-b0cc-4833-b838-2fbb797a341e',
  '50718356-c256-46ae-9858-9108de88d41c',
  '48672813-c762-4ca6-9ce0-19aa1e3e9238',
];

const GoaGatewaySection = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await Promise.all(
        goaList?.map(id => getCampaignByIdAPI(id)),
      );
      const transformedCampaigns = response?.map(campaign => ({
        ...campaign,
        storeData: campaign?.storesData?.[0],
      }));
      setCampaigns(transformedCampaigns);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const campaignCard = campaign => {
    const mediaType = getMediaTypeFromPath(campaign.banner);
    return (
      <View className="border border-gray-200 rounded-xl overflow-hidden">
        {mediaType === 'video' ? (
          <Video
            source={{uri: getMediaURL(campaign.banner)}}
            style={{width: 310, height: 240}}
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
            style={{width: 310, height: 240, objectFit: 'cover'}}
          />
        )}
        <View className="absolute top-2 left-2">
          <Text className="bg-white font-bold text-md text-indigo-600 border-indigo-600 border px-3 py-1 rounded-full">
            {
              campaign?.requirements?.[0]?.creatorType?.[0]?.stayDuration
                ?.nights
            }{' '}
            Nights{' '}
            {campaign?.requirements?.[0]?.creatorType?.[0]?.stayDuration?.days}{' '}
            Days
          </Text>
        </View>
        <View className="py-3 px-3 flex-row justify-between items-start">
          <View className="flex-col gap-2">
            <Text className="text-xl font-semibold w-52" numberOfLines={1}>
              {campaign?.name}
            </Text>
            <Text className="text-gray-500 w-52" numberOfLines={1}>
              {campaign?.storesData?.[0]?.city},
              {campaign?.storesData?.[0]?.state}
            </Text>
            <Text className="text-gray-700 font-medium bg-blue-50 self-start px-2 py-1 rounded-full">
              {formatNumber(getLowestMinFollowers(campaign.requirements) || 0)}+
            </Text>
          </View>
          <View className="flex-col justify-end items-end gap-2">
            <Text className="text-xl font-semibold" numberOfLines={1}>
              ₹{campaign?.storesData?.[0]?.avgPrice || 0}
            </Text>
            <Text className="">Avg Price</Text>
            <Text className="bg-blue-400 font-semibold text-white self-end px-2 py-1 rounded-lg">
              Free
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          GOA GATEWAYS, ON THE HOUSE
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={campaigns}
        keyExtractor={(item, index) => item + index}
        renderItem={({item: campaign}) => campaignCard(campaign)}
      />
      <TouchableOpacity className="flex-row justify-center items-center gap-2">
        <Text className="text-indigo-600 font-semibold border-indigo-600 border px-6 py-2  rounded-md">
          VIEW ALL
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoaGatewaySection;

import {View, Text, Image} from 'react-native';
import {useEffect, useState} from 'react';
import {Icons} from '../../../../assets/icons';
import {getCampaignByIdAPI} from '../../../../services/handleApi';
import {FlatList} from 'react-native-gesture-handler';
import {
  formatNumber,
  getMediaURL,
  getLowestMinFollowers,
  getMediaTypeFromPath,
} from '../../../../utility/helper';
import Video from 'react-native-video';

const internationalBeachStaysList = [
  '33fc915c-460a-482e-bed9-fc54f4bdcdf2',
  '55fb0701-333b-4659-92d8-badc34a3ee2b',
  '95df6fbb-4f3a-41f2-a539-ab820aa414f2',
  'cd6287ad-f45f-41b9-bea0-6fa0c8d61ac2',
  '0307ae6e-ae38-4119-b617-feb47362f232',
];

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
          {campaign?.requirements?.[0]?.creatorType?.[0]?.stayDuration?.nights}{' '}
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
            {campaign?.storesData?.[0]?.city},{campaign?.storesData?.[0]?.state}
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

const InternationalBeachStaysSection = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await Promise.all(
        internationalBeachStaysList?.map(id => getCampaignByIdAPI(id)),
      );
      setCampaigns(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          INTERNATIONAL BEACH STAYS
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={campaigns}
        keyExtractor={(item, index) => item?.id + index}
        renderItem={({item: campaign}) => campaignCard(campaign)}
      />
    </View>
  );
};

export default InternationalBeachStaysSection;

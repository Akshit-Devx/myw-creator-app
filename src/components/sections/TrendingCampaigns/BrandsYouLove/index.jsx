import React, {useEffect, useState} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {Icons} from '../../../../assets/icons';
import {getCampaignByIdAPI} from '../../../../services/handleApi';
import {getBrandMediaURL} from '../../../../utility/helper';

const brandsYouLoveList = [
  'fc55e679-2970-4768-9644-5c0fc6b3f66d',
  '0e7695e4-2b05-49ba-a8f5-4e353863757a',
  '89f6f7b0-3ea3-44ba-95d7-220511166769',
  'a96f77ff-a243-470f-9763-a23a9b3b43ed',
  'b9234bc0-a4a3-4777-9eed-7ae0d399e80d',
  '8c2bea22-c7a8-4afe-8b8c-2a7a9940850e',
];

const campaignCard = campaign => {
  return (
    <View className="flex-col items-center gap-2">
      <Image
        source={{uri: getBrandMediaURL(campaign?.brandLogo)}}
        className="w-32 h-32 rounded-full object-cover border border-gray-200"
      />
      <Text className="text-center text-md w-36" numberOfLines={1}>
        {campaign?.brandName}
      </Text>
    </View>
  );
};

const BrandsYouLoveSection = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await Promise.all(
        brandsYouLoveList?.map(id => getCampaignByIdAPI(id)),
      );
      const transformedCampaigns = response?.map(campaign => ({
        ...campaign,
        storeData: campaign?.storesData?.[0],
      }));
      setCampaigns(transformedCampaigns);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          BRANDS YOU'LL LOVE
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

export default BrandsYouLoveSection;

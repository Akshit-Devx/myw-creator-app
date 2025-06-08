import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getCampaignByIdAPI} from '../../../../services/handleApi';
import {Icons} from '../../../../assets/icons';
import FeaturedCampaignBarterCard from '../../../cards/FeaturedCampaignBarter';

const hotCollabsList = [
  '682c2cf0-fc1a-4364-b8cc-50d65f0bc26f',
  'd7866896-5c2d-4af6-ab85-4b6cd8511df6',
  '63688e9d-7c01-4829-8d24-904efe76844c',
  'a778bf2f-3354-4c3f-8b39-285e4d98b13d',
  'a2d39983-97c7-44d6-944e-a2f4845e2c8a',
  '281561d3-e5fc-4120-b028-fee61a2ebb95',
  '1d15758e-05cf-47b7-a092-d3dc06316e8c',
];

const HotCollabsSection = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await Promise.all(
        hotCollabsList?.map(id => getCampaignByIdAPI(id)),
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
          🔥 HOT COLLABS 🔥
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={campaigns}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({item: campaign}) => (
          <FeaturedCampaignBarterCard campaign={campaign} />
        )}
      />
    </View>
  );
};

export default HotCollabsSection;

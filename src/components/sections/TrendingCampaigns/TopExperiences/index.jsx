import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icons} from '../../../../assets/icons';
import {CAMPAIGN_CATEGORIES_LIST} from '../../../../utility/common';
import {convertToTitleCase} from '../../../../utility/helper';
import {getCampaignByIdAPI} from '../../../../services/handleApi';
import BarterCampaignCard from '../../../cards/BarterCampaign';
import BarterCampaignCardSkeleton from '../../../skeletons/BarterCampaignCard';

const restaurantList = [
  '259ecf2e-3916-4307-8cb7-d6877fddcf89',
  '2c4fd73d-796e-4bb4-bf52-38e2bcc8fb83',
  'dd896284-c7c1-4088-b021-ab5b8d558c79',
  'b2d3aa84-73c0-4769-86a8-50625a7ad164',
  'f173ba9f-e1d0-4aa5-8d17-dfdc5afd6cd0',
  'efb133e6-540e-4933-85da-62dc978f9980',
  'f7e736a0-5d46-4102-bebe-98d4e86d67b8',
  'e29dde1b-874b-46bc-ab05-4852c1aa5d52',
];

const salonList = [
  'fba3ae63-4904-40b5-a5a5-c85bdceb67a2',
  '616664de-0232-4d40-a12a-66fa05f5c1cc',
  'bcf0d29c-7e1c-4113-abb1-50411be3f773',
  '357f79ca-77e2-40d8-8261-56068ed4fcc8',
  '1e3a83c5-923c-4673-8a83-293dc1e2f9d8',
  'a1cd52b5-96b5-4776-8d2c-14f813d0b207',
];

const resortsList = [
  'a221e518-86d7-4879-818d-8e836bc36ba2',
  'd0d9d5c5-c68c-4f40-a0d8-7682ee8f1496',
  '8fe8423a-a444-40b1-b6d1-fe65bdc47d24',
  'e8789c70-6e88-4d50-b9a2-bb9e5a597f9a',
  '228dfa34-2ee7-4935-943c-43f1a46174cc',
  'bc4f3f41-62cf-47a3-87d4-aa2fd4001028',
  '59fe66af-2300-451d-ba29-409e685f9a86',
  '0c13511e-8c73-4416-bc62-a71633598718',
  '94437546-ec89-49f9-8c15-cff1560b07ed',
];

const TopExperiencesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('RESTAURANTS');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedCategory === 'RESTAURANTS') {
        response = await Promise.all(
          restaurantList?.map(id => getCampaignByIdAPI(id)),
        );
      } else if (selectedCategory === 'SALONS') {
        response = await Promise.all(
          salonList?.map(id => getCampaignByIdAPI(id)),
        );
      } else if (selectedCategory === 'RESORTS') {
        response = await Promise.all(
          resortsList?.map(id => getCampaignByIdAPI(id)),
        );
      }
      const transformedResponse = response?.map(campaign => ({
        ...campaign,
        storeData: campaign?.storesData?.[0],
      }));
      setCampaigns(transformedResponse);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-col gap-4">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          TOP EXPERIENCES
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <View className="flex-row gap-2 justify-center items-center">
        {CAMPAIGN_CATEGORIES_LIST.map(item => (
          <TouchableOpacity onPress={() => setSelectedCategory(item)}>
            <Text
              className={`${
                selectedCategory === item
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-white border border-gray-200'
              } px-4 py-2 rounded-full`}>
              {convertToTitleCase(item)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={loading ? [1, 2, 3, 4] : campaigns}
        keyExtractor={(item, index) =>
          loading ? `skeleton-${index}` : item.id + index
        }
        renderItem={({item: campaign}) =>
          loading ? (
            <BarterCampaignCardSkeleton />
          ) : (
            <BarterCampaignCard campaign={campaign} />
          )
        }
      />
    </View>
  );
};

export default TopExperiencesSection;

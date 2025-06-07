import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {Icons} from '../../../assets/icons';
import {filterCampaignAPI} from '../../../services/handleApi';
import {convertToTitleCase} from '../../../utility/helper';
import BarterCampaignCard from '../../cards/BarterCampaign';
import FeaturedCampaignBarterCard from '../../cards/FeaturedCampaignBarter';
import FeaturedCampaignOfferCard from '../../cards/FeaturedCampaignOffer';
import OfferCampaignCard from '../../cards/OfferCampaign';
import CampaignTypeButton from '../../common/CampaignTypeButton';

const RestaurantsCampaignsSection = () => {
  const [selectedType, setSelectedType] = useState('BARTER');
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchFeaturedCampaigns();
    fetchNonFeaturedCampaigns();
  }, [selectedType]);

  const fetchFeaturedCampaigns = async () => {
    try {
      const featuredCampaignsResponse = await filterCampaignAPI({
        type: selectedType || 'BARTER',
        category: 'RESTAURANTS',
        isFeatured: true,
        size: 50,
        page: 1,
      });

      const transformedFeaturedCampaigns =
        featuredCampaignsResponse.items.flatMap(campaign => {
          return (campaign.storesData || []).map(store => ({
            ...campaign,
            storeData: store,
          }));
        });

      setFeaturedCampaigns(transformedFeaturedCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchNonFeaturedCampaigns = async () => {
    try {
      const campaignsResponse = await filterCampaignAPI({
        type: selectedType || 'BARTER',
        category: 'RESTAURANTS',
        isFeatured: false,
        size: 50,
        page: 1,
      });

      const transformedCampaigns = campaignsResponse.items.flatMap(campaign => {
        return (campaign.storesData || []).map(store => ({
          ...campaign,
          storeData: store,
        }));
      });

      setCampaigns(transformedCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  console.log('featuredCampaigns', featuredCampaigns);
  console.log('campaigns', campaigns);

  return (
    <View className="flex-col gap-8">
      <CampaignTypeButton
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-xl font-semibold">
            Featured {convertToTitleCase(selectedType)}s
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={featuredCampaigns}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({item: campaign}) =>
            selectedType === 'BARTER' ? (
              <FeaturedCampaignBarterCard campaign={campaign} />
            ) : (
              <FeaturedCampaignOfferCard campaign={campaign} />
            )
          }
        />
      </View>
      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-xl font-semibold">
            {convertToTitleCase(selectedType)}s
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={campaigns}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({item: campaign}) =>
            selectedType === 'BARTER' ? (
              <BarterCampaignCard campaign={campaign} />
            ) : (
              <OfferCampaignCard campaign={campaign} />
            )
          }
        />
      </View>
    </View>
  );
};

export default RestaurantsCampaignsSection;

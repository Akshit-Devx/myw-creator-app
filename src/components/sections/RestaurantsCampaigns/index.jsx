import React, {useEffect, useState} from 'react';
import {Text, View, FlatList} from 'react-native';
import CampaignTypeButton from '../../common/CampaignTypeButton';
import {Icons} from '../../../assets/icons';
import {convertToTitleCase} from '../../../utility/helper';
import {filterCampaignAPI} from '../../../services/handleApi';
import FeaturedCampaignBarterCard from '../../cards/FeaturedCampaignBarter';
import FeaturedCampaignOfferCard from '../../cards/FeaturedCampaignOffer';
import {ScrollView} from 'react-native-gesture-handler';
import BarterCampaignCard from '../../cards/BarterCampaign';
import OfferCampaignCard from '../../cards/OfferCampaign';

const RestaurantsCampaignsSection = () => {
  const [selectedType, setSelectedType] = useState('BARTER');
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [featuredCampaignsPagination, setFeaturedCampaignsPagination] =
    useState({
      total: 0,
      page: 1,
      size: 10,
      totalPages: 1,
      nextToken: null,
    });
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsPagination, setCampaignsPagination] = useState({
    total: 0,
    page: 1,
    size: 10,
    totalPages: 1,
    nextToken: null,
  });

  useEffect(() => {
    fetchCampaigns(true);
  }, [selectedType]);

  const fetchCampaigns = async (resetData = true) => {
    try {
      // Fetch Featured Campaigns
      const featuredCampaignsResponse = await filterCampaignAPI({
        type: selectedType || 'BARTER',
        category: 'RESTAURANTS',
        isFeatured: true,
        size: 10,
        page: featuredCampaignsPagination.page,
      });

      const transformedFeaturedCampaigns =
        featuredCampaignsResponse.items.flatMap(campaign => {
          return (campaign.storesData || []).map(store => ({
            ...campaign,
            storeData: store,
          }));
        });

      setFeaturedCampaigns(prevCampaigns =>
        resetData
          ? transformedFeaturedCampaigns
          : [...prevCampaigns, ...transformedFeaturedCampaigns],
      );
      setFeaturedCampaignsPagination(featuredCampaignsResponse.pagination);

      // Fetch Non-Featured Campaigns
      const campaignsResponse = await filterCampaignAPI({
        type: selectedType || 'BARTER',
        category: 'RESTAURANTS',
        isFeatured: false,
        size: 10,
        page: campaignsPagination.page,
      });

      const transformedCampaigns = campaignsResponse.items.flatMap(campaign => {
        return (campaign.storesData || []).map(store => ({
          ...campaign,
          storeData: store,
        }));
      });

      setCampaigns(prevCampaigns =>
        resetData
          ? transformedCampaigns
          : [...prevCampaigns, ...transformedCampaigns],
      );
      setCampaignsPagination(campaignsResponse.pagination);
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
          onEndReached={() => {
            if (campaignsPagination.page < campaignsPagination.totalPages) {
              setCampaignsPagination(prev => ({
                ...prev,
                page: prev.page + 1,
              }));
              fetchCampaigns(false);
            }
          }}
          onEndReachedThreshold={0.5}
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
          onEndReached={() => {
            if (campaignsPagination.page < campaignsPagination.totalPages) {
              setCampaignsPagination(prev => ({
                ...prev,
                page: prev.page + 1,
              }));
              fetchCampaigns(false);
            }
          }}
          onEndReachedThreshold={0.5}
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

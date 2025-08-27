import {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {Icons} from '../../../assets/icons';
import {filterCampaignAPI} from '../../../services/handleApi';
import {convertToTitleCase} from '../../../utility/helper';
import BarterCampaignCard from '../../cards/BarterCampaign';
import FeaturedCampaignBarterCard from '../../cards/FeaturedCampaignBarter';
import FeaturedCampaignOfferCard from '../../cards/FeaturedCampaignOffer';
import OfferCampaignCard from '../../cards/OfferCampaign';
import CampaignTypeButton from '../../common/CampaignTypeButton';
import BarterCampaignCardSkeleton from '../../skeletons/BarterCampaignCard';
import FeaturedCampaignBarterCardSkeleton from '../../skeletons/FeaturedCampaignBarterCard';
import FeaturedCampaignOfferCardSkeleton from '../../skeletons/FeaturedCampaignOfferCard';
import OfferCampaignCardSkeleton from '../../skeletons/OfferCampaignCard';
import {CAMPAIGN_TYPES} from '../../../utility/common';
import Filters from '../Filters';

const SalonsCampaignsSection = () => {
  const [selectedType, setSelectedType] = useState(CAMPAIGN_TYPES[0]);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [collabsFilterParams, setCollabsFilterParams] = useState({});
  const [offerFilterParams, setOfferFilterParams] = useState({});

  const fetchFeaturedCampaigns = async () => {
    setIsLoadingFeatured(true);
    try {
      const featuredCampaignsResponse = await filterCampaignAPI({
        type: selectedType?.value || 'BARTER',
        category: 'SALONS',
        isFeatured: true,
        size: 50,
        page: 1,
        ...(selectedType?.value === 'BARTER'
          ? {...collabsFilterParams}
          : {...offerFilterParams}),
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
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  const fetchNonFeaturedCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const campaignsResponse = await filterCampaignAPI({
        type: selectedType?.value || 'BARTER',
        category: 'SALONS',
        isFeatured: false,
        size: 50,
        page: 1,
        ...(selectedType?.value === 'BARTER'
          ? {...collabsFilterParams}
          : {...offerFilterParams}),
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
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCampaigns();
    fetchNonFeaturedCampaigns();
  }, [selectedType, collabsFilterParams, offerFilterParams]);

  return (
    <View className="flex-col gap-8">
      <CampaignTypeButton
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      {selectedType?.value === 'BARTER' ? (
        <Filters
          setFiltersParams={setCollabsFilterParams}
          filtersParams={collabsFilterParams}
        />
      ) : (
        <Filters
          setFiltersParams={setOfferFilterParams}
          filtersParams={offerFilterParams}
        />
      )}
      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-xl font-semibold">
            Featured {convertToTitleCase(selectedType?.label)}s
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={isLoadingFeatured ? [1, 2, 3] : featuredCampaigns}
          keyExtractor={(item, index) =>
            isLoadingFeatured ? `skeleton-${index}` : item.id + index
          }
          renderItem={({item: campaign}) =>
            isLoadingFeatured ? (
              selectedType?.value === 'BARTER' ? (
                <FeaturedCampaignBarterCardSkeleton />
              ) : (
                <FeaturedCampaignOfferCardSkeleton />
              )
            ) : selectedType?.value === 'BARTER' ? (
              <FeaturedCampaignBarterCard campaign={campaign} />
            ) : (
              <FeaturedCampaignOfferCard campaign={campaign} />
            )
          }
          ListEmptyComponent={
            <View className="w-full flex-1 items-center justify-center">
              <Text className="text-center text-gray-700 font-semibold text-lg">
                No campaigns found
              </Text>
            </View>
          }
        />
      </View>

      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-xl font-semibold">
            {convertToTitleCase(selectedType?.label)}s
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={isLoadingCampaigns ? [1, 2, 3, 4] : campaigns}
          keyExtractor={(item, index) =>
            isLoadingCampaigns ? `skeleton-${index}` : item.id + index
          }
          renderItem={({item: campaign}) =>
            isLoadingCampaigns ? (
              selectedType?.value === 'BARTER' ? (
                <BarterCampaignCardSkeleton />
              ) : (
                <OfferCampaignCardSkeleton />
              )
            ) : selectedType?.value === 'BARTER' ? (
              <BarterCampaignCard campaign={campaign} />
            ) : (
              <OfferCampaignCard campaign={campaign} />
            )
          }
          ListEmptyComponent={
            <View className="w-full flex-1 items-center justify-center">
              <Text className="text-center text-gray-700 font-semibold text-lg">
                No campaigns found
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default SalonsCampaignsSection;

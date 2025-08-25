import {useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import {useSelector} from 'react-redux';

import Filters from '../Filters';
import {Icons} from '../../../assets/icons';
import {CAMPAIGN_TYPES} from '../../../utility/common';
import OfferCampaignCard from '../../cards/OfferCampaign';
import BarterCampaignCard from '../../cards/BarterCampaign';
import {filterCampaignAPI} from '../../../services/handleApi';
import CampaignTypeButton from '../../common/CampaignTypeButton';
import OfferCampaignCardSkeleton from '../../skeletons/OfferCampaignCard';
import BarterCampaignCardSkeleton from '../../skeletons/BarterCampaignCard';

const {width: WINDOW_WIDTH} = Dimensions.get('window');

const ForYouCampaignsSection = () => {
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [selectedType, setSelectedType] = useState(CAMPAIGN_TYPES[0]);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offerFilterParams, setOfferFilterParams] = useState({});
  const [collabsFilterParams, setCollabsFilterParams] = useState({});

  // Pagination state for each category
  const [categoryPagination, setCategoryPagination] = useState({});
  const [loadingMore, setLoadingMore] = useState({});

  useEffect(() => {
    fetchCampaigns(true); // Reset on filter/type change
  }, [selectedType, offerFilterParams, collabsFilterParams]);

  const fetchCampaigns = async (reset = false) => {
    if (reset) {
      setIsLoading(true);
      setCategoryPagination({});
      setLoadingMore({});
    }

    try {
      const payload = {
        type: selectedType?.value || 'BARTER',
        size: 10, // Increased size for better pagination
        page: 1,
        minFollowers:
          onBoarding?.instagramDetails?.followersCount < 1000
            ? 0
            : onBoarding?.instagramDetails?.followersCount,
        comparisonOperator: 'lte',
        ...(selectedType?.value === 'BARTER'
          ? {...collabsFilterParams}
          : {...offerFilterParams}),
      };
      const featuredCampaignResponse = await filterCampaignAPI(payload);

      if (reset) {
        setFeaturedCampaigns(featuredCampaignResponse.items);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      if (reset) {
        setIsLoading(false);
      }
    }
  };

  const fetchMoreCampaignsForCategory = async category => {
    const currentPage = categoryPagination[category]?.page || 1;
    const nextPage = currentPage + 1;

    // Prevent multiple simultaneous requests
    if (loadingMore[category]) return;

    setLoadingMore(prev => ({...prev, [category]: true}));

    try {
      const payload = {
        type: selectedType?.value || 'BARTER',
        size: 5, // Smaller size for pagination
        page: nextPage,
        category: category !== 'Uncategorized' ? category : null,
        minFollowers:
          onBoarding?.instagramDetails?.followersCount < 1000
            ? 0
            : onBoarding?.instagramDetails?.followersCount,
        comparisonOperator: 'lte',
        ...(selectedType?.value === 'BARTER'
          ? {...collabsFilterParams}
          : {...offerFilterParams}),
      };
      const response = await filterCampaignAPI(payload);

      if (response.items && response.items.length > 0) {
        // Add new campaigns to existing ones
        setFeaturedCampaigns(prev => [...prev, ...response.items]);

        // Update pagination state for this category
        setCategoryPagination(prev => ({
          ...prev,
          [category]: {
            page: nextPage,
            hasMore: response.items.length === payload.size,
            totalLoaded:
              (prev[category]?.totalLoaded || 0) + response.items.length,
          },
        }));
      } else {
        // No more items for this category
        setCategoryPagination(prev => ({
          ...prev,
          [category]: {
            ...prev[category],
            hasMore: false,
          },
        }));
      }
    } catch (error) {
      console.error(`Error fetching more campaigns for ${category}:`, error);
    } finally {
      setLoadingMore(prev => ({...prev, [category]: false}));
    }
  };

  const campaignsByStore = useMemo(() => {
    const result = [];

    featuredCampaigns?.forEach(campaign => {
      campaign.storesData?.forEach(store => {
        result.push({
          store,
          campaign,
        });
      });
    });

    return result;
  }, [featuredCampaigns]);

  const campaignsByCategory = {};

  campaignsByStore?.forEach(item => {
    const campaign = item.campaign;
    const store = item.store;
    const category = campaign?.category || 'Uncategorized';

    if (!campaignsByCategory[category]) {
      campaignsByCategory[category] = [];
    }

    campaignsByCategory[category].push({campaign, store});
  });

  const categories = Object.keys(campaignsByCategory);

  const handleEndReached = category => {
    const pagination = categoryPagination[category];
    const hasMore = pagination?.hasMore !== false; // Default to true if undefined
    if (hasMore && !loadingMore[category]) {
      fetchMoreCampaignsForCategory(category);
    }
  };

  const LoadingMoreIndicator = () => (
    <View className="justify-center items-center px-4" style={{width: 80}}>
      <ActivityIndicator size="small" color="#666" />
    </View>
  );

  const LoadingSkeleton = () => {
    return (
      <View className="flex-row gap-5 px-1">
        {[1, 2, 3, 4].map((item, index) => {
          if (selectedType?.value === 'BARTER') {
            return (
              <BarterCampaignCardSkeleton
                key={`restaurant-skeleton-${index}`}
              />
            );
          }
          return (
            <OfferCampaignCardSkeleton key={`restaurant-skeleton-${index}`} />
          );
        })}
      </View>
    );
  };

  const renderCampaignItem = ({item: campaign}) =>
    campaign.campaign?.type === 'BARTER' ? (
      <View className="" style={{width: WINDOW_WIDTH - 100}}>
        <BarterCampaignCard
          campaign={campaign.campaign}
          store={campaign.store}
        />
      </View>
    ) : (
      <View className="" style={{width: WINDOW_WIDTH - 100}}>
        <OfferCampaignCard
          campaign={campaign.campaign}
          store={campaign.store}
        />
      </View>
    );

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

      {categories?.map(category => (
        <View key={category} className="flex-col gap-8">
          <View className="flex-row justify-center items-center gap-2">
            <Icons.LeftGradientLine height={24} width={60} />
            <Text className="text-center text-xl font-semibold text-gray-500">
              {`TOP ${category} ${selectedType?.label.toLocaleUpperCase()}`}
            </Text>
            <Icons.RightGradientLine height={24} width={60} />
          </View>

          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-5 px-1"
              data={campaignsByCategory[category]}
              keyExtractor={(item, index) =>
                `${item.campaign.id}-${index}-${category}`
              }
              renderItem={renderCampaignItem}
              onEndReached={() => handleEndReached(category)}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingMore[category] ? LoadingMoreIndicator : null
              }
              ListEmptyComponent={
                <View className="flex-col gap-8">
                  <Text className="text-center text-xl text-gray-500 font-semibold">
                    No Campaigns Found
                  </Text>
                </View>
              }
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default ForYouCampaignsSection;

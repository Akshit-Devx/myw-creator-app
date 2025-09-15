import {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  View,
} from 'react-native';
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
import Filters from '../Filters';
import {CAMPAIGN_TYPES_TAB} from '../../../utility/common';

const RestaurantsCampaignsSection = () => {
  const [selectedType, setSelectedType] = useState(CAMPAIGN_TYPES_TAB[0]);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [filtersParams, setFiltersParams] = useState({});
  const [collabsFilterParams, setCollabsFilterParams] = useState({});
  const [page, setPage] = useState(1);
  const [hasMoreFeatured, setHasMoreFeatured] = useState(true);
  const [nextTokenFeaturedCampaigns, setNextTokenFeaturedCampaigns] =
    useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isLoadingMoreNonFeatured, setIsLoadingMoreNonFeatured] =
    useState(false);

  const fetchFeaturedCampaigns = useCallback(
    async (pageNum = 1, append = false) => {
      // Prevent multiple simultaneous requests
      if (isLoadingMore && pageNum > 1) return;
      if (!hasMoreFeatured && append) return;

      setIsLoadingFeatured(pageNum === 1);
      if (pageNum > 1) setIsLoadingMore(true);

      try {
        const payload = {
          type: selectedType?.value || 'BARTER',
          category: 'RESTAURANTS',
          isFeatured: true,
          size: 50,
          page: pageNum,
          ...(nextTokenFeaturedCampaigns && pageNum > 1
            ? {nextToken: nextTokenFeaturedCampaigns}
            : {}),
          ...filtersParams,
          ...collabsFilterParams,
        };
        const featuredCampaignsResponse = await filterCampaignAPI(payload);

        const transformedFeaturedCampaigns =
          featuredCampaignsResponse.items.flatMap(campaign => {
            return (campaign.storesData || []).map(store => ({
              ...campaign,
              storeData: store,
            }));
          });

        setFeaturedCampaigns(prev =>
          append
            ? [...prev, ...transformedFeaturedCampaigns]
            : transformedFeaturedCampaigns,
        );

        // Update pagination states
        const {pagination} = featuredCampaignsResponse;
        const newNextToken = pagination?.nextToken || null;
        const newHasMore =
          !!newNextToken && pageNum < (pagination?.totalPages || 0);
        setNextTokenFeaturedCampaigns(newNextToken);
        setHasMoreFeatured(newHasMore);
        setPage(pageNum);
      } catch (error) {
        console.error('Error fetching featured campaigns:', error);
      } finally {
        setIsLoadingFeatured(false);
        setIsLoadingMore(false);
      }
    },
    [
      selectedType,
      filtersParams,
      collabsFilterParams,
      nextTokenFeaturedCampaigns,
      hasMoreFeatured,
      isLoadingMore,
    ],
  );

  const fetchNonFeaturedCampaigns = useCallback(
    async (pageNum = 1, append = false) => {
      // Prevent multiple simultaneous requests
      if (isLoadingMoreNonFeatured && pageNum > 1) return;
      if (append) return;

      setIsLoadingCampaigns(pageNum === 1);
      if (pageNum > 1) setIsLoadingMoreNonFeatured(true);

      try {
        const payload = {
          type: selectedType?.value || 'BARTER',
          category: 'RESTAURANTS',
          isFeatured: false,
          size: 50,
          page: pageNum,
          sortBy: 'minFollowers',
          ...filtersParams,
          ...collabsFilterParams,
        };

        const campaignsResponse = await filterCampaignAPI(payload);
        const transformedCampaigns = campaignsResponse.items.flatMap(
          campaign => {
            return (campaign.storesData || []).map(store => ({
              ...campaign,
              storeData: store,
            }));
          },
        );

        setCampaigns(prev =>
          append ? [...prev, ...transformedCampaigns] : transformedCampaigns,
        );

      } catch (error) {
        console.error('Error fetching non-featured campaigns:', error);
      } finally {
        setIsLoadingCampaigns(false);
        setIsLoadingMoreNonFeatured(false);
      }
    },
    [
      selectedType,
      filtersParams,
      collabsFilterParams,
      isLoadingMoreNonFeatured,
    ],
  );

  const handleLoadMoreFeatured = () => {
    if (!isLoadingMore && hasMoreFeatured) {
      fetchFeaturedCampaigns(page + 1, true);
    }
  };

  useEffect(() => {
    // Reset pagination states
    setPage(1);
    setNextTokenFeaturedCampaigns(null);
    setFeaturedCampaigns([]);
    setCampaigns([]);

    setCampaigns([]);
    setIsLoadingMoreNonFeatured(false);

    // Fetch fresh data
    fetchFeaturedCampaigns(1, false);
    fetchNonFeaturedCampaigns(1, false);
  }, [selectedType, filtersParams, collabsFilterParams]);

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return selectedType?.value === 'BARTER' ? (
      <FeaturedCampaignBarterCardSkeleton />
    ) : (
      <FeaturedCampaignOfferCardSkeleton />
    );
  };

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
          setFiltersParams={setFiltersParams}
          filtersParams={filtersParams}
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
          onEndReached={handleLoadMoreFeatured}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          scrollEventThrottle={16}
          renderItem={({item: campaign}) =>
            isLoadingFeatured ? (
              selectedType?.value === 'BARTER' ? (
                <FeaturedCampaignBarterCardSkeleton />
              ) : (
                <FeaturedCampaignOfferCardSkeleton />
              )
            ) : selectedType?.value === 'BARTER' ? (
              <FeaturedCampaignBarterCard
                campaign={campaign}
                cards={featuredCampaigns}
              />
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
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={6}
        />
      </View>
    </View>
  );
};

export default RestaurantsCampaignsSection;

import React, {useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import {Marquee} from '@animatereactnative/marquee';

import Filters from '../Filters';
import {Icons} from '../../../assets/icons';
import {productCategories} from '../../../utility/common';
import {filterCampaignAPI} from '../../../services/handleApi';
import ProductCampaignCard from '../../cards/ProductCampaignCard';
import FeaturedCampaignBarterCard from '../../cards/FeaturedCampaignBarter';
import FeaturedCampaignBarterCardSkeleton from '../../skeletons/FeaturedCampaignBarterCard';

const LoadingSkeleton = () => {
  return (
    <View className="flex-row gap-5 px-1">
      {[1, 2, 3, 4].map((item, index) => {
        return (
          <FeaturedCampaignBarterCardSkeleton
            key={`restaurant-skeleton-${index}`}
          />
        );
      })}
    </View>
  );
};

const LoadingMoreIndicator = () => (
  <View className="justify-center items-center px-4" style={{width: 80}}>
    <ActivityIndicator size="small" color="#666" />
  </View>
);

const ProductsCampaignsSection = () => {
  const [collabsFilterParams, setCollabsFilterParams] = useState({});
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [allCampaigns, setAllCampaigns] = useState([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasMore: false,
    nextToken: null,
  });

  const fetchFeaturedCampaigns = async (reset = false) => {
    if (reset) {
      setIsLoadingFeatured(true);
      setPagination({
        page: 1,
        totalPages: 1,
        hasMore: false,
        nextToken: null,
      });
    } else {
      setIsLoadingMore(true);
    }

    try {
      const currentPage = reset ? 1 : pagination.page + 1;

      const payload = {
        type: 'BARTER',
        category: 'PRODUCTS',
        isFeatured: true,
        size: reset ? 10 : 5, // Smaller size for pagination loads
        page: currentPage,
        ...collabsFilterParams,
      };

      // Add nextToken if available (for cursor-based pagination)
      if (!reset && pagination.nextToken) {
        payload.nextToken = pagination.nextToken;
      }

      const featuredCampaignsResponse = await filterCampaignAPI(payload);

      const transformedFeaturedCampaigns =
        featuredCampaignsResponse.items.flatMap(campaign => {
          return (campaign.storesData || []).map(store => ({
            ...campaign,
            storeData: store,
          }));
        });

      if (reset) {
        setFeaturedCampaigns(transformedFeaturedCampaigns);
      } else {
        // Append new campaigns to existing ones
        setFeaturedCampaigns(prev => [
          ...prev,
          ...transformedFeaturedCampaigns,
        ]);
      }

      // Update pagination state
      const paginationData = featuredCampaignsResponse?.pagination;
      if (paginationData) {
        setPagination({
          page: paginationData.page,
          totalPages: paginationData.totalPages,
          hasMore:
            paginationData.page < paginationData.totalPages ||
            (paginationData.nextToken &&
              transformedFeaturedCampaigns.length > 0),
          nextToken: paginationData.nextToken || null,
        });
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      if (reset) {
        setIsLoadingFeatured(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  const fetchCampaigns = async () => {
    try {
      const payload = {
        type: 'BARTER',
        category: 'PRODUCTS',
        size: 10,
        page: 1,
        ...collabsFilterParams,
      };
      const featuredCampaigns = await filterCampaignAPI(payload);
      setAllCampaigns(featuredCampaigns?.items);
    } catch (error) {
      console.error('Error: in fetchCampaigns', error);
    }
  };

  const loadMoreCampaigns = () => {
    // Prevent multiple simultaneous requests
    if (isLoadingMore || !pagination.hasMore) {
      return;
    }

    fetchFeaturedCampaigns(false);
  };

  const handleEndReached = () => {
    loadMoreCampaigns();
  };

  useEffect(() => {
    fetchFeaturedCampaigns(true); // Reset on filter/type change
    fetchCampaigns();
  }, [collabsFilterParams]);

  const campaignsByStore = useMemo(() => {
    const result = [];

    allCampaigns?.forEach(campaign => {
      campaign.storesData?.forEach(store => {
        result.push({
          store,
          campaign,
        });
      });
    });

    return result;
  }, [allCampaigns]);

  const renderCampaignItem = ({item: campaign}) => (
    <FeaturedCampaignBarterCard campaign={campaign} />
  );

  const renderCampaignItemByStore = ({item: campaign}) => (
    <ProductCampaignCard campaign={campaign?.campaign} store={campaign.store} />
  );

  return (
    <View className="flex-col gap-8">
      <Filters
        setFiltersParams={setCollabsFilterParams}
        filtersParams={collabsFilterParams}
        isProductSection={true}
      />

      {featuredCampaigns?.length > 0 && (
        <View className="flex-col gap-8">
          <View className="flex-row justify-center items-center gap-2">
            <Icons.LeftGradientLine height={24} width={60} />
            <Text className="text-center text-xl text-gray-700 font-semibold">
              FEATURED COLLABS
            </Text>
            <Icons.RightGradientLine height={24} width={60} />
          </View>

          {isLoadingFeatured ? (
            <LoadingSkeleton />
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-5 px-1"
              data={featuredCampaigns}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderCampaignItem}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isLoadingMore ? LoadingMoreIndicator : null}
              ListEmptyComponent={
                !isLoadingFeatured ? (
                  <View className="flex-col gap-8">
                    <Text className="text-center text-xl text-gray-500 font-semibold">
                      No Featured Campaigns Found
                    </Text>
                  </View>
                ) : null
              }
            />
          )}
        </View>
      )}
      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-xl text-gray-700 font-semibold">
            {'Categories'.toUpperCase()}
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <View className="flex-row gap-4">
          {productCategories?.map(i => {
            return (
              <View className="flex-col gap-1 flex-1">
                <View className="bg-[#f7ecff] h-[100] p-2 rounded-lg justify-center items-center">
                  <FastImage
                    source={{uri: i?.image}}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-center text-sm text-gray-700 font-semibold">
                  {i?.name}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      <View className="overflow-hidden">
        <Marquee spacing={20} speed={1} style={styles.marquee}>
          <Text className="text-md font-semibold text-black">
            GET FAST APPROVAL ON THESE PRODUCT ✨
          </Text>
        </Marquee>
      </View>
      <View>
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-xl text-gray-700 font-semibold">
            {'COLLABS'.toUpperCase()}
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          data={campaignsByStore}
          renderItem={renderCampaignItemByStore}
          contentContainerClassName="gap-5 px-1"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default ProductsCampaignsSection;

const styles = StyleSheet.create({
  marquee: {
    backgroundColor: '#d4ff1e',
    paddingVertical: 8,
  },
  categoryImage: {
    width: 75,
    height: 75,
  },
});

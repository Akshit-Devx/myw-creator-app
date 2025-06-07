import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Icons} from '../../../assets/icons';
import {filterCampaignAPI} from '../../../services/handleApi';
import BarterCampaignCard from '../../cards/BarterCampaign';
import OfferCampaignCard from '../../cards/OfferCampaign';
import CampaignTypeButton from '../../common/CampaignTypeButton';
import BarterCampaignCardSkeleton from '../../skeletons/BarterCampaignCard';
import OfferCampaignCardSkeleton from '../../skeletons/OfferCampaignCard';

const CAMPAIGN_CATEGORIES = ['RESTAURANTS', 'RESORTS', 'SALONS'];

const ForYouCampaignsSection = () => {
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [selectedType, setSelectedType] = useState('BARTER');
  const [restaurantCampaigns, setRestaurantCampaigns] = useState([]);
  const [resortCampaigns, setResortCampaigns] = useState([]);
  const [salonCampaigns, setSalonCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, [selectedType]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const campaignResponse = await Promise.all(
        CAMPAIGN_CATEGORIES.map(category =>
          filterCampaignAPI({
            type: selectedType || 'BARTER',
            category,
            minFollowers:
              onBoarding?.instagramDetails?.followersCount < 1000
                ? 0
                : onBoarding?.instagramDetails?.followersCount,
            comparisonOperator: 'lte',
            size: 5,
            page: 1,
          }),
        ),
      );

      const transformedRestaurantCampaigns = campaignResponse[0].items.flatMap(
        campaign => {
          return (campaign.storesData || []).map(store => ({
            ...campaign,
            storeData: store,
          }));
        },
      );

      const transformedResortCampaigns = campaignResponse[1].items.flatMap(
        campaign => {
          return (campaign.storesData || []).map(store => ({
            ...campaign,
            storeData: store,
          }));
        },
      );

      const transformedSalonCampaigns = campaignResponse[2].items.flatMap(
        campaign => {
          return (campaign.storesData || []).map(store => ({
            ...campaign,
            storeData: store,
          }));
        },
      );

      setRestaurantCampaigns(transformedRestaurantCampaigns);
      setResortCampaigns(transformedResortCampaigns);
      setSalonCampaigns(transformedSalonCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-col gap-8">
      <CampaignTypeButton
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {!!restaurantCampaigns.length && (
        <View className="flex-col gap-8">
          <View className="flex-row justify-center items-center gap-2">
            <Icons.LeftGradientLine height={24} width={60} />
            <Text className="text-center text-xl font-semibold">
              TOP RESTAURANTS {selectedType}
            </Text>
            <Icons.RightGradientLine height={24} width={60} />
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-5 px-1"
            data={isLoading ? [1, 2, 3, 4] : restaurantCampaigns}
            keyExtractor={(item, index) =>
              isLoading ? `skeleton-${index}` : item.id + index
            }
            renderItem={({item: campaign}) =>
              isLoading ? (
                selectedType === 'BARTER' ? (
                  <BarterCampaignCardSkeleton />
                ) : (
                  <OfferCampaignCardSkeleton />
                )
              ) : selectedType === 'BARTER' ? (
                <BarterCampaignCard campaign={campaign} />
              ) : (
                <OfferCampaignCard campaign={campaign} />
              )
            }
          />
        </View>
      )}

      {!!resortCampaigns.length && (
        <View className="flex-col gap-8">
          <View className="flex-row justify-center items-center gap-2">
            <Icons.LeftGradientLine height={24} width={60} />
            <Text className="text-center text-xl font-semibold">
              TOP RESORTS {selectedType}
            </Text>
            <Icons.RightGradientLine height={24} width={60} />
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-5 px-1"
            data={isLoading ? [1, 2, 3, 4] : resortCampaigns}
            keyExtractor={(item, index) =>
              isLoading ? `skeleton-${index}` : item.id + index
            }
            renderItem={({item: campaign}) =>
              isLoading ? (
                selectedType === 'BARTER' ? (
                  <BarterCampaignCardSkeleton />
                ) : (
                  <OfferCampaignCardSkeleton />
                )
              ) : selectedType === 'BARTER' ? (
                <BarterCampaignCard campaign={campaign} />
              ) : (
                <OfferCampaignCard campaign={campaign} />
              )
            }
          />
        </View>
      )}

      {!!salonCampaigns.length && (
        <View className="flex-col gap-8">
          <View className="flex-row justify-center items-center gap-2">
            <Icons.LeftGradientLine height={24} width={60} />
            <Text className="text-center text-xl font-semibold">
              TOP SALONS {selectedType}
            </Text>
            <Icons.RightGradientLine height={24} width={60} />
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-5 px-1"
            data={isLoading ? [1, 2, 3, 4] : salonCampaigns}
            keyExtractor={(item, index) =>
              isLoading ? `skeleton-${index}` : item.id + index
            }
            renderItem={({item: campaign}) =>
              isLoading ? (
                selectedType === 'BARTER' ? (
                  <BarterCampaignCardSkeleton />
                ) : (
                  <OfferCampaignCardSkeleton />
                )
              ) : selectedType === 'BARTER' ? (
                <BarterCampaignCard campaign={campaign} />
              ) : (
                <OfferCampaignCard campaign={campaign} />
              )
            }
          />
        </View>
      )}
    </View>
  );
};

export default ForYouCampaignsSection;

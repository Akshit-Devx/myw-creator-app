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
import BarterCampaignCardSkeleton from '../../skeletons/BarterCampaignCard';
import FeaturedCampaignBarterCardSkeleton from '../../skeletons/FeaturedCampaignBarterCard';
import FeaturedCampaignOfferCardSkeleton from '../../skeletons/FeaturedCampaignOfferCard';
import OfferCampaignCardSkeleton from '../../skeletons/OfferCampaignCard';

const HotelsCampaignsSection = () => {
  const [selectedType, setSelectedType] = useState('BARTER');
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);

  useEffect(() => {
    fetchFeaturedCampaigns();
    fetchNonFeaturedCampaigns();
  }, [selectedType]);

  const fetchFeaturedCampaigns = async () => {
    setIsLoadingFeatured(true);
    try {
      const featuredCampaignsResponse = await filterCampaignAPI({
        type: selectedType || 'BARTER',
        category: 'RESORTS',
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
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  const fetchNonFeaturedCampaigns = async () => {
    setIsLoadingCampaigns(true);
    try {
      const campaignsResponse = await filterCampaignAPI({
        type: selectedType || 'BARTER',
        category: 'RESORTS',
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
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  return (
    <View className="flex-col gap-8">
      <CampaignTypeButton
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      {!!featuredCampaigns.length && (
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
            data={isLoadingFeatured ? [1, 2, 3] : featuredCampaigns}
            keyExtractor={(item, index) =>
              isLoadingFeatured ? `skeleton-${index}` : item.id + index
            }
            renderItem={({item: campaign}) =>
              isLoadingFeatured ? (
                selectedType === 'BARTER' ? (
                  <FeaturedCampaignBarterCardSkeleton />
                ) : (
                  <FeaturedCampaignOfferCardSkeleton />
                )
              ) : selectedType === 'BARTER' ? (
                <FeaturedCampaignBarterCard campaign={campaign} />
              ) : (
                <FeaturedCampaignOfferCard campaign={campaign} />
              )
            }
          />
        </View>
      )}

      {!!campaigns.length && (
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
            data={isLoadingCampaigns ? [1, 2, 3, 4] : campaigns}
            keyExtractor={(item, index) =>
              isLoadingCampaigns ? `skeleton-${index}` : item.id + index
            }
            renderItem={({item: campaign}) =>
              isLoadingCampaigns ? (
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

export default HotelsCampaignsSection;

// import React, {useEffect, useState} from 'react';
// import {FlatList, Text, View} from 'react-native';
// import {useSelector} from 'react-redux';
// import {Icons} from '../../../assets/icons';
// import {filterCampaignAPI} from '../../../services/handleApi';
// import BarterCampaignCard from '../../cards/BarterCampaign';
// import OfferCampaignCard from '../../cards/OfferCampaign';
// import CampaignTypeButton from '../../common/CampaignTypeButton';
// import BarterCampaignCardSkeleton from '../../skeletons/BarterCampaignCard';
// import OfferCampaignCardSkeleton from '../../skeletons/OfferCampaignCard';

// const CAMPAIGN_CATEGORIES = ['RESTAURANTS', 'RESORTS', 'SALONS'];

// const ForYouCampaignsSection = () => {
//   const {onBoarding} = useSelector(state => state.onBoarding);
//   const [selectedType, setSelectedType] = useState('COLLABS');
//   const [restaurantCampaigns, setRestaurantCampaigns] = useState([]);
//   const [resortCampaigns, setResortCampaigns] = useState([]);
//   const [salonCampaigns, setSalonCampaigns] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchCampaigns();
//   }, [selectedType]);

//   const fetchCampaigns = async () => {
//     setIsLoading(true);
//     try {
//       const campaignResponse = await Promise.all(
//         CAMPAIGN_CATEGORIES.map(category =>
//           filterCampaignAPI({
//             type: (selectedType != 'COLLABS' && selectedType) || 'BARTER',
//             category,
//             minFollowers:
//               onBoarding?.instagramDetails?.followersCount < 1000
//                 ? 0
//                 : onBoarding?.instagramDetails?.followersCount,
//             comparisonOperator: 'lte',
//             size: 5,
//             page: 1,
//           }),
//         ),
//       );

//       const transformedRestaurantCampaigns = campaignResponse[0].items.flatMap(
//         campaign => {
//           return (campaign.storesData || []).map(store => ({
//             ...campaign,
//             storeData: store,
//           }));
//         },
//       );

//       const transformedResortCampaigns = campaignResponse[1].items.flatMap(
//         campaign => {
//           return (campaign.storesData || []).map(store => ({
//             ...campaign,
//             storeData: store,
//           }));
//         },
//       );

//       const transformedSalonCampaigns = campaignResponse[2].items.flatMap(
//         campaign => {
//           return (campaign.storesData || []).map(store => ({
//             ...campaign,
//             storeData: store,
//           }));
//         },
//       );

//       setRestaurantCampaigns(transformedRestaurantCampaigns);
//       setResortCampaigns(transformedResortCampaigns);
//       setSalonCampaigns(transformedSalonCampaigns);
//     } catch (error) {
//       console.error('Error fetching campaigns:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View className="flex-col gap-8">
//       <CampaignTypeButton
//         selectedType={selectedType}
//         setSelectedType={setSelectedType}
//       />

//       <View className="flex-col gap-8 ">
//         <View className="flex-row justify-center items-center gap-2">
//           <Icons.LeftGradientLine height={24} width={60} />
//           <Text className="text-center text-lg font-semibold text-[#626262]">
//             TOP RESTAURANTS {selectedType}
//           </Text>
//           <Icons.RightGradientLine height={24} width={60} />
//         </View>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerClassName="gap-5 px-1"
//           data={isLoading ? [1, 2, 3, 4] : restaurantCampaigns}
//           keyExtractor={(item, index) =>
//             isLoading ? `skeleton-${index}` : item.id + index
//           }
//           renderItem={({item: campaign}) =>
//             isLoading ? (
//               selectedType === 'COLLABS' ? (
//                 <BarterCampaignCardSkeleton />
//               ) : (
//                 <OfferCampaignCardSkeleton />
//               )
//             ) : selectedType === 'COLLABS' ? (
//               <BarterCampaignCard campaign={campaign} />
//             ) : (
//               <OfferCampaignCard campaign={campaign} />
//             )
//           }
//         />
//       </View>

//       <View className="flex-col gap-8">
//         <View className="flex-row justify-center items-center gap-2">
//           <Icons.LeftGradientLine height={24} width={60} />
//           <Text className="text-center text-lg font-semibold text-[#626262]">
//             TOP RESORTS {selectedType}
//           </Text>
//           <Icons.RightGradientLine height={24} width={60} />
//         </View>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerClassName="gap-5 px-1"
//           data={isLoading ? [1, 2, 3, 4] : resortCampaigns}
//           keyExtractor={(item, index) =>
//             isLoading ? `skeleton-${index}` : item.id + index
//           }
//           renderItem={({item: campaign}) =>
//             isLoading ? (
//               selectedType === 'COLLABS' ? (
//                 <BarterCampaignCardSkeleton />
//               ) : (
//                 <OfferCampaignCardSkeleton />
//               )
//             ) : selectedType === 'COLLABS' ? (
//               <BarterCampaignCard campaign={campaign} />
//             ) : (
//               <OfferCampaignCard campaign={campaign} />
//             )
//           }
//         />
//       </View>

//       <View className="flex-col gap-8">
//         <View className="flex-row justify-center items-center gap-2">
//           <Icons.LeftGradientLine height={24} width={60} />
//           <Text className="text-center text-lg font-semibold text-[#626262]">
//             TOP SALONS {selectedType}
//           </Text>
//           <Icons.RightGradientLine height={24} width={60} />
//         </View>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerClassName="gap-5 px-1"
//           data={isLoading ? [1, 2, 3, 4] : salonCampaigns}
//           keyExtractor={(item, index) =>
//             isLoading ? `skeleton-${index}` : item.id + index
//           }
//           renderItem={({item: campaign}) =>
//             isLoading ? (
//               selectedType === 'COLLABS' ? (
//                 <BarterCampaignCardSkeleton />
//               ) : (
//                 <OfferCampaignCardSkeleton />
//               )
//             ) : selectedType === 'COLLABS' ? (
//               <BarterCampaignCard campaign={campaign} />
//             ) : (
//               <OfferCampaignCard campaign={campaign} />
//             )
//           }
//         />
//       </View>
//     </View>
//   );
// };

// export default ForYouCampaignsSection;

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
import Filters from '../../Filters/Filters';
import OfferFilterModal from '../../OfferFilterModal/OfferFilterModal';
import FeaturedCampaignBarterCardSkeleton from '../../skeletons/FeaturedCampaignBarterCard';
import FeaturedCampaignOfferCardSkeleton from '../../skeletons/FeaturedCampaignOfferCard';
import FeaturedCampaignBarterCard from '../../cards/FeaturedCampaignBarter';
import FeaturedCampaignOfferCard from '../../cards/FeaturedCampaignOffer';

const CAMPAIGN_CATEGORIES = ['RESTAURANTS', 'RESORTS', 'SALONS'];

const ForYouCampaignsSection = () => {
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [selectedType, setSelectedType] = useState('COLLABS');
  const [restaurantCampaigns, setRestaurantCampaigns] = useState([]);
  const [restaurantCampaignsOffer, setRestaurantCampaignsOffer] = useState([]);
  const [resortCampaigns, setResortCampaigns] = useState([]);
  const [resortCampaignsOffer, setResortCampaignsOffer] = useState([]);
  const [salonCampaigns, setSalonCampaigns] = useState([]);
  const [salonCampaignsOffer, setSalonCampaignsOffer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [featuredCampaignsOffer, setFeaturedCampaignsOffer] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);

  useEffect(() => {
    if (selectedType == 'COLLABS') {
      if (
        resortCampaigns.length == 0 &&
        salonCampaigns.length == 0 &&
        restaurantCampaigns.length == 0 &&
        featuredCampaigns.length == 0
      ) {
        fetchCampaigns();
        fetchFeaturedCampaigns();
      }
    } else {
      if (
        restaurantCampaignsOffer.length == 0 &&
        resortCampaignsOffer.length == 0 &&
        salonCampaignsOffer.length == 0 &&
        featuredCampaignsOffer.length == 0
      ) {
        fetchCampaigns();
        fetchFeaturedCampaigns();
      }
    }
  }, [selectedType]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const campaignResponse = await Promise.all(
        CAMPAIGN_CATEGORIES.map(category =>
          filterCampaignAPI({
            type: (selectedType != 'COLLABS' && selectedType) || 'BARTER',
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

      if (selectedType != 'COLLABS') {
        setRestaurantCampaignsOffer(transformedRestaurantCampaigns);
        setResortCampaignsOffer(transformedResortCampaigns);
        setSalonCampaignsOffer(transformedSalonCampaigns);
      } else {
        setRestaurantCampaigns(transformedRestaurantCampaigns);
        setResortCampaigns(transformedResortCampaigns);
        setSalonCampaigns(transformedSalonCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedCampaigns = async () => {
    setIsLoadingFeatured(true);
    try {
      const featuredCampaignsResponse = await Promise.all(
        CAMPAIGN_CATEGORIES.map(category =>
          filterCampaignAPI({
            type: (selectedType != 'COLLABS' && selectedType) || 'BARTER',
            category,
            isFeatured: true,
            comparisonOperator: 'lte',
            size: 5,
            page: 1,
          }),
        ),
      );

      const transformedFeaturedCampaigns = featuredCampaignsResponse.flatMap(
        (response, index) => {
          return response.items.flatMap(campaign => {
            return (campaign.storesData || []).map(store => ({
              ...campaign,
              storeData: store,
            }));
          });
        },
      );

      if (selectedType != 'COLLABS') {
        setFeaturedCampaignsOffer(transformedFeaturedCampaigns);
      } else {
        setFeaturedCampaigns(transformedFeaturedCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  return (
    <View className="flex-col gap-4">
      <CampaignTypeButton
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <Filters
        selectedIndex={selectedType}
        selectedCategory={'FOR_YOU'}
        setFilterModal={setFilterModal}
      />

      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-lg font-semibold text-[#626262]">
            FEATURED {selectedType}
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={
            isLoadingFeatured
              ? [1, 2, 3]
              : selectedType === 'COLLABS'
              ? featuredCampaigns
              : featuredCampaignsOffer
          }
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

      <View className="flex-col gap-8 ">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-lg font-semibold text-[#626262]">
            TOP RESTAURANTS {selectedType}
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={
            isLoading
              ? [1, 2, 3, 4]
              : selectedType === 'COLLABS'
              ? restaurantCampaigns
              : resortCampaignsOffer
          }
          keyExtractor={(item, index) =>
            isLoading ? `skeleton-${index}` : item.id + index
          }
          renderItem={({item: campaign}) =>
            isLoading ? (
              selectedType === 'COLLABS' ? (
                <BarterCampaignCardSkeleton />
              ) : (
                <OfferCampaignCardSkeleton />
              )
            ) : selectedType === 'COLLABS' ? (
              <BarterCampaignCard campaign={campaign} />
            ) : (
              <OfferCampaignCard campaign={campaign} />
            )
          }
        />
      </View>

      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-lg font-semibold text-[#626262]">
            TOP RESORTS {selectedType}
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={
            isLoading
              ? [1, 2, 3, 4]
              : selectedType === 'COLLABS'
              ? resortCampaigns
              : resortCampaignsOffer
          }
          keyExtractor={(item, index) =>
            isLoading ? `skeleton-${index}` : item.id + index
          }
          renderItem={({item: campaign}) =>
            isLoading ? (
              selectedType === 'COLLABS' ? (
                <BarterCampaignCardSkeleton />
              ) : (
                <OfferCampaignCardSkeleton />
              )
            ) : selectedType === 'COLLABS' ? (
              <BarterCampaignCard campaign={campaign} />
            ) : (
              <OfferCampaignCard campaign={campaign} />
            )
          }
        />
      </View>

      <View className="flex-col gap-8">
        <View className="flex-row justify-center items-center gap-2">
          <Icons.LeftGradientLine height={24} width={60} />
          <Text className="text-center text-lg font-semibold text-[#626262]">
            TOP SALONS {selectedType}
          </Text>
          <Icons.RightGradientLine height={24} width={60} />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-5 px-1"
          data={
            isLoading
              ? [1, 2, 3, 4]
              : selectedType === 'COLLABS'
              ? salonCampaigns
              : salonCampaignsOffer
          }
          keyExtractor={(item, index) =>
            isLoading ? `skeleton-${index}` : item.id + index
          }
          renderItem={({item: campaign}) =>
            isLoading ? (
              selectedType === 'COLLABS' ? (
                <BarterCampaignCardSkeleton />
              ) : (
                <OfferCampaignCardSkeleton />
              )
            ) : selectedType === 'COLLABS' ? (
              <BarterCampaignCard campaign={campaign} />
            ) : (
              <OfferCampaignCard campaign={campaign} />
            )
          }
        />
      </View>
      <OfferFilterModal
        open={filterModal}
        onClose={() => setFilterModal(false)}
        // setFilterParams={setFilterParams}
        // selectedCategory={selectedCategory}
      />
    </View>
  );
};

export default ForYouCampaignsSection;

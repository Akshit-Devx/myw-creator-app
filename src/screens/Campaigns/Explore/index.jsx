import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import ForYouCampaignsSection from '../../../components/sections/ForYouCampaigns';
import HotelsCampaignsSection from '../../../components/sections/HotelsCampaigns';
import RestaurantsCampaignsSection from '../../../components/sections/RestaurantsCampaigns';
import SalonsCampaignsSection from '../../../components/sections/SalonsCampaigns';
import TrendingCampaignsSection from '../../../components/sections/TrendingCampaigns';
import {CAMPAIGN_CATEGORIES} from '../../../utility/common';
import SearchBar from '../../../components/common/SearchBar';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';

// const CategoryButton = ({category, isSelected, onPress}) => (
//   <TouchableOpacity
//     className="flex-col items-center gap-2 px-3"
//     onPress={onPress}>
//     <LinearGradient
//       colors={['#9C2CF3', '#1A47E8']}
//       start={{x: 0, y: 0}}
//       end={{x: 1, y: 0}}
//       style={{
//         // height: 150,
//         // width: 200,
//         borderRadius: 100,
//         flex: 1,
//       }}>
//       <View
//         style={{
//           borderRadius: 100,
//           flex: 1,
//           margin: 3,
//           justifyContent: 'center',
//         }}>
//         <View
//           className={`border p-3 rounded-full bg-white h-[70px] w-[70px] items-center justify-center`}>
//           <category.icon height={37} width={37} />
//         </View>
//       </View>
//     </LinearGradient>

//     <Text
//       className={`text-center text-sm font-semibold ${
//         isSelected ? 'text-[#0033e6]' : ''
//       }`}>
//       {category.label}
//     </Text>
//   </TouchableOpacity>
// );

const CategoryButton = ({category, isSelected, onPress}) => {
  const BorderWrapper = isSelected ? LinearGradient : View;
  const borderProps = isSelected
    ? {
        colors: ['#9C2CF3', '#1A47E8'],
        start: {x: 0, y: 0},
        end: {x: 1, y: 0},
      }
    : {};

  return (
    <TouchableOpacity
      className="flex-col items-center gap-2 px-3"
      onPress={onPress}>
      <BorderWrapper
        {...borderProps}
        style={{
          borderRadius: 100,
          flex: 1,
        }}>
        <View
          style={{
            borderRadius: 100,
            flex: 1,
            margin: isSelected ? 3 : 0,
            justifyContent: 'center',
          }}>
          <View className="p-3 rounded-full bg-white h-[70px] w-[70px] items-center justify-center">
            <category.icon height={37} width={37} />
          </View>
        </View>
      </BorderWrapper>

      <Text
        className={`text-center text-sm font-semibold ${
          isSelected ? 'text-[#0033e6]' : ''
        }`}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );
};

const ExploreScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('TRENDING');

  return (
    <SafeAreaView className="bg-[#F8F8F8]">
      <TopNav />
      <ScrollView showsVerticalScrollIndicator={false} className="bg-[#F8F8F8]">
        <SearchBar />
        <View className="flex-1 flex-col gap-7 p-5 ">
          <View className="mt-1">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row">
              <View className="flex-row gap-3">
                {CAMPAIGN_CATEGORIES.map(category => (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onPress={() => setSelectedCategory(category.id)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
          {selectedCategory === 'TRENDING' && <TrendingCampaignsSection />}
          {selectedCategory === 'FOR_YOU' && <ForYouCampaignsSection />}
          {selectedCategory === 'HOTELS' && <HotelsCampaignsSection />}
          {selectedCategory === 'SALONS' && <SalonsCampaignsSection />}
          {selectedCategory === 'RESTAURANTS' && (
            <RestaurantsCampaignsSection />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;

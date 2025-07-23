import {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import ForYouCampaignsSection from '../../../components/sections/ForYouCampaigns';
import HotelsCampaignsSection from '../../../components/sections/HotelsCampaigns';
import RestaurantsCampaignsSection from '../../../components/sections/RestaurantsCampaigns';
import SalonsCampaignsSection from '../../../components/sections/SalonsCampaigns';
import TrendingCampaignsSection from '../../../components/sections/TrendingCampaigns';
import {CAMPAIGN_CATEGORIES} from '../../../utility/common';

const CategoryButton = ({category, isSelected, onPress}) => (
  <TouchableOpacity className="flex-col items-center gap-2" onPress={onPress}>
    <View
      className={`border p-3 rounded-full ${
        isSelected ? 'border-[#0033e6]' : 'border-gray-100'
      }`}>
      <category.icon height={48} width={48} />
    </View>
    <Text className={`text-center ${isSelected ? 'text-[#0033e6]' : ''}`}>
      {category.label}
    </Text>
  </TouchableOpacity>
);

const ExploreScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('TRENDING');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="bg-white h-full">
      <View className="flex-1 flex-col gap-7 p-5">
        <View>
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
        {selectedCategory === 'RESTAURANTS' && <RestaurantsCampaignsSection />}
      </View>
    </ScrollView>
  );
};

export default ExploreScreen;

import React from 'react';
import {Text, View} from 'react-native';
import {Icons} from '../../../assets/icons';
import InternationalBeachStaysSection from './InternationalBeachStays';
import RelaxAndRechargeSection from './RelaxAndRecharge';
import TopPicksSection from './TopPicks';
import CreatorsUsingLinkInBioSection from './CreatorsUsingLinkInBio';
import OurTopCreatorSection from './OurTopCreator';
import HotCollabsSection from './HotCollabs';
import FoodCategoriesSection from './FoodCategories';
import BrandsYouLoveSection from './BrandsYouLove';
import CreatorStoriesSection from './CreatorStories';
import GoaGatewaySection from './GoaGateway';
import TopExperiencesSection from './TopExperiences';
import StayGlobalSection from './StayGlobal';

const TrendingCampaignsSection = () => {
  return (
    <View className="flex-col gap-8">
      <TopPicksSection />
      <TopExperiencesSection />
      <GoaGatewaySection />
      <CreatorStoriesSection />
      <FoodCategoriesSection />
      <BrandsYouLoveSection />
      <StayGlobalSection />
      <HotCollabsSection />
      <OurTopCreatorSection />
      <CreatorsUsingLinkInBioSection />
      <InternationalBeachStaysSection />
      <RelaxAndRechargeSection />
    </View>
  );
};

export default TrendingCampaignsSection;

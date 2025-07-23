import {View} from 'react-native';
import BrandsYouLoveSection from './BrandsYouLove';
import CreatorStoriesSection from './CreatorStories';
import CreatorsUsingLinkInBioSection from './CreatorsUsingLinkInBio';
import FoodCategoriesSection from './FoodCategories';
import GoaGatewaySection from './GoaGateway';
import HotCollabsSection from './HotCollabs';
import InternationalBeachStaysSection from './InternationalBeachStays';
import OurTopCreatorSection from './OurTopCreator';
import RelaxAndRechargeSection from './RelaxAndRecharge';
import StayGlobalSection from './StayGlobal';
import TopExperiencesSection from './TopExperiences';
import TopPicksSection from './TopPicks';

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

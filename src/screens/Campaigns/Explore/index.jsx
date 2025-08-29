import {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import ForYouCampaignsSection from '../../../components/sections/ForYouCampaigns';
import HotelsCampaignsSection from '../../../components/sections/HotelsCampaigns';
import RestaurantsCampaignsSection from '../../../components/sections/RestaurantsCampaigns';
import SalonsCampaignsSection from '../../../components/sections/SalonsCampaigns';
import TrendingCampaignsSection from '../../../components/sections/TrendingCampaigns';
import {CAMPAIGN_CATEGORIES} from '../../../utility/common';
import ProductsCampaignsSection from '../../../components/sections/ProductsCampaignsSection';
import {checkSubscriptionStatus} from '../../../utility/helper';
import {useSelector} from 'react-redux';
import {getWhitelistByInfluencerIdAPI} from '../../../services/handleApi';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import SubscribeModal from '../../../components/modals/SubscribeModal';
import PaymentSuccessModal from '../../../components/modals/PaymentSuccessModal';

const CategoryButton = ({category, isSelected, onPress}) => (
  <TouchableOpacity
    className="flex-col items-center gap-2 relative"
    onPress={onPress}>
    <View
      className={`border p-3 rounded-full ${
        isSelected ? 'border-[#0033e6]' : 'border-gray-100'
      }`}>
      <category.icon height={48} width={48} />
      {category.id === 'PRODUCTS' && (
        <Text
          className={
            'text-center w-[70px] absolute bottom-[-4px] self-center text-[6px] bg-[#ffedf1] px-2 py-1 rounded-full text-[#ff7a00]'
          }>
          Newly Launched
        </Text>
      )}
    </View>
    <Text className={`text-center ${isSelected ? 'text-[#0033e6]' : ''}`}>
      {category.label}
    </Text>
  </TouchableOpacity>
);

const ExploreScreen = () => {
  const navigation = useNavigation();

  const {subscription} = useSelector(state => state.subscription);
  const {onBoarding} = useSelector(state => state.onBoarding);
  const isSubscribed = checkSubscriptionStatus(subscription);

  const [selectedCategory, setSelectedCategory] = useState('TRENDING');
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [whitelistChecked, setWhitelistChecked] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);

  const getWhitelist = useCallback(async () => {
    const whitelist = await getWhitelistByInfluencerIdAPI(onBoarding.id);
    if (whitelist?.length) {
      if (!!whitelist[0]?.id && !!whitelist[0]?.isActive)
        setIsWhiteListed(true);
    }
    setWhitelistChecked(true);
  }, [onBoarding.id]);

  const showPopUp = useCallback(() => {
    if (!isSubscribed && !isWhiteListed && whitelistChecked) {
      setShowSubscribeModal(true);
    }
  }, [isSubscribed, isWhiteListed, whitelistChecked]);

  const handleKnowMore = () => {
    try {
      setShowSubscribeModal(false);
      setTimeout(() => {
        navigation.navigate('Detail', {
          screen: 'Pricing',
        });
      }, 400);
    } catch (error) {
      console.error('Error: in handleKnowMore', error);
    }
  };

  useEffect(() => {
    if (onBoarding?.id && whitelistChecked) {
      const timer = setTimeout(() => {
        showPopUp();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onBoarding, whitelistChecked, showPopUp]);

  useFocusEffect(
    useCallback(() => {
      if (onBoarding.id) {
        getWhitelist();
      }
    }, [onBoarding, getWhitelist]),
  );

  return (
    <>
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
          {selectedCategory === 'PRODUCTS' && <ProductsCampaignsSection />}
          {selectedCategory === 'HOTELS' && <HotelsCampaignsSection />}
          {selectedCategory === 'SALONS' && <SalonsCampaignsSection />}
          {selectedCategory === 'RESTAURANTS' && (
            <RestaurantsCampaignsSection />
          )}
        </View>
      </ScrollView>

      {showSubscribeModal && (
        <SubscribeModal
          visible={showSubscribeModal}
          onClose={() => {
            setShowSubscribeModal(false);
          }}
          setPaymentSuccessModal={setPaymentSuccessModal}
          variant="upsell"
          setSubscriptionModal={setShowSubscribeModal}
          handleKnowMore={handleKnowMore}
        />
      )}

      <PaymentSuccessModal
        visible={paymentSuccessModal}
        onClose={() => setPaymentSuccessModal(false)}
        handleDone={() => setPaymentSuccessModal(false)}
      />
    </>
  );
};

export default ExploreScreen;

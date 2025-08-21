import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import RazorpayCheckout from 'react-native-razorpay';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';

import {Icons} from '../../../../assets/icons';
import {campaignsPlans} from '../../../../utility/common';
import {RAZORPAY_KEY} from '../../../../config/envConfig';
import {checkSubscriptionStatus} from '../../../../utility/helper';
import {fetchInfluencerById} from '../../../../store/slices/onBoarding';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';
import PaymentSuccessModal from '../../../../components/modals/PaymentSuccessModal';
import {
  createRazorpayCheckoutAPI,
  createSubscriptionPurchasedAPI,
} from '../../../../services/handleApi';

const Pricing = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const {onBoarding} = useSelector(state => state.onBoarding);
  const {subscription} = useSelector(state => state.subscription);

  const isSubscribed = checkSubscriptionStatus(subscription);
  const currentPlanInterval = subscription?.planInterval;
  const planInterval = route?.params?.planInterval;

  const [btnLoading, setBtnLoading] = useState(false);
  const [plan, setPlan] = useState(campaignsPlans.monthly);
  const [paymentSuccessModal, setPaymentSuccessModal] = useState(false);
  const [isAnnual, setIsAnnual] = useState(planInterval === 'year' || false);

  const handleToggle = useCallback(() => {
    setIsAnnual(pre => !pre);
  }, []);

  const getButtonText = () => {
    if (!isSubscribed) {
      return 'Subscribe now';
    }

    if (currentPlanInterval === 'month') {
      return isAnnual ? 'Upgrade to Annual plan' : 'Already Subscribed';
    } else if (currentPlanInterval === 'year') {
      return !isAnnual ? 'Switch to Monthly plan' : 'Already Subscribed';
    }

    return 'Subscribe now';
  };

  const handleSubscribeClick = useCallback(async () => {
    try {
      setBtnLoading(true);
      const payload = {
        influencerId: onBoarding?.id,
        phone: onBoarding?.phone,
        // email: onBoarding?.email,
        planId: plan.planId,
        count: plan.count,
      };
      const response = await createRazorpayCheckoutAPI(payload);

      const options = {
        key: RAZORPAY_KEY, // Your Razorpay API key
        subscription_id: response?.session, // Subscription ID from backend
        name: 'My Wall',
        image: Icons.MywallLogo, // Must be a URL
        description: '',
        prefill: {
          contact: onBoarding?.phone, // Phone number from onBoarding object
        },
        theme: {
          color: '#1677ff', // Same theme color as web
        },
      };

      // Open Razorpay checkout
      RazorpayCheckout.open(options)
        .then(data => {
          handlePaymentSuccess(data, response?.customerId);
        })
        .catch(error => {
          if (error?.code === 0) {
            setBtnLoading(false);
            Alert.alert('Payment Failed', error?.description);
            return;
          }
          console.error('Error: in RazorpayCheckout', error);
        });
    } catch (error) {
      console.error('Error in handleSubscribeClick', error);
    }
  }, [
    handlePaymentSuccess,
    onBoarding?.id,
    onBoarding?.phone,
    plan.count,
    plan.planId,
  ]);

  const handlePaymentSuccess = useCallback(
    async (data, customerId) => {
      try {
        setBtnLoading(true);

        const payload = {
          id: customerId,
          influencerId: onBoarding?.id,
          phone: onBoarding?.phone,
          // email: onBoarding?.email,
          razorpayCustomerId: customerId,
          razorpaySubscriptionId: data?.razorpay_subscription_id,
          isActive: true,
          planId: plan.planId,
          planName: plan.name,
          planPricing: plan.price,
          planInterval: plan.recurring,
        };

        await createSubscriptionPurchasedAPI(payload);

        dispatch(fetchInfluencerById(onBoarding?.id));
        setPaymentSuccessModal(true);
      } catch (error) {
        console.error('Error: in handlePaymentSuccess', error);
      } finally {
        setBtnLoading(false);
      }
    },
    [dispatch, onBoarding?.id, onBoarding?.phone, plan],
  );

  const handleDone = useCallback(() => {
    setPaymentSuccessModal(false);
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setPlan(!isAnnual ? campaignsPlans.monthly : campaignsPlans.yearly);
  }, [isAnnual]);

  const renderItem = ({item}) => {
    return (
      <View className="flex-row items-center gap-5 ">
        {item.icon}
        <Text className="text-xl text-white font-medium">{item.label}</Text>
      </View>
    );
  };

  const listHeaderComponent = () => {
    return (
      <Text className="text-2xl text-white font-semibold text-center my-[30]">
        All with One Simple Monthly Subscription
      </Text>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader onLeftPress={() => navigation.goBack()} />
      <View className="flex-col flex-1 gap-5 bg-[#1a1329] p-5">
        <View className="p-4 flex-1 border border-b-[0] mt-[70] border-t-4 rounded-lg border-l-[#00e5ff] border-r-[#00e5ff] border-t-[#9849ff] relative">
          <View className="bg-white p-2 rounded-full absolute top-[-60] self-center border-2 border-[#9849ff] z-20">
            <Icons.MywallLogoWithName width={80} height={80} />
          </View>

          <FlatList
            data={plan?.features}
            renderItem={renderItem}
            ListHeaderComponent={listHeaderComponent}
            ItemSeparatorComponent={() => (
              <View className="h-[1] bg-gray-500 my-4" />
            )}
            keyExtractor={(item, index) => index.toString()}
            className="grow-1"
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View className="flex-col gap-5">
          {planInterval !== 'year' && (
            <TouchableOpacity
              onPress={handleToggle}
              activeOpacity={0.7}
              disabled={btnLoading}
              className={`bg-[#1a1a2e] p-2 rounded-lg border flex-row items-center gap-3 ${
                isAnnual ? 'border-[#FFFFFF1A]' : 'border-[#4d32fc]'
              }`}>
              <View
                className={`w-[18] h-[18] rounded-full justify-center items-center ${
                  isAnnual ? 'bg-white' : 'bg-[#1777ff]'
                }`}>
                <View className="w-[9] h-[9] rounded-full bg-white" />
              </View>
              <View className="flex-col gap-1">
                <View className="flex-row items-center gap-1">
                  <Text className="text-white font-bold text-2xl">₹ 299</Text>
                  <Text className="text-[#ffffff99] text-lg font-medium">
                    / month
                  </Text>
                </View>
                <Text className="text-[#ffffffcc] font-medium text-lg">
                  Monthly Subscription
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleToggle}
            activeOpacity={0.7}
            disabled={btnLoading}
            className={`bg-[#1a1a2e] p-2 rounded-lg border flex-row items-center gap-3 relative ${
              isAnnual ? 'border-[#4d32fc]' : 'border-[#FFFFFF1A]'
            }`}>
            <View
              className={`w-[18] h-[18] rounded-full justify-center items-center ${
                isAnnual ? 'bg-[#1777ff]' : 'bg-white'
              }`}>
              <View className="w-[9] h-[9] rounded-full bg-white" />
            </View>
            <View className="flex-col gap-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-[#ffffff99] font-bold text-xl line-through">
                  ₹ 299
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-white font-bold text-2xl">₹ 249</Text>
                  <Text className="text-[#ffffff99] text-lg font-medium">
                    / month
                  </Text>
                </View>
              </View>
              <Text className="text-[#ffffffcc] font-medium text-lg">
                ₹2,999 Yearly Subscription
              </Text>
            </View>
            <LinearGradient
              colors={['#4d32fc', '#9747ff']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.popular}>
              <View className="py-2 px-4 rounded-full">
                <Text className="text-white text-md font-medium">Popular</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full h-[44] rounded-xl"
            disabled={btnLoading}
            key={btnLoading.toString()}
            onPress={handleSubscribeClick}>
            <LinearGradient
              colors={['#4d32fc', '#9747ff']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradient}>
              {btnLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-xl font-medium">
                  {getButtonText()}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <PaymentSuccessModal
        visible={paymentSuccessModal}
        onClose={() => setPaymentSuccessModal(false)}
        handleDone={handleDone}
      />
    </View>
  );
};

export default Pricing;

const styles = StyleSheet.create({
  gradient: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    shadowColor: '#4d32fc',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    height: 44,
  },
  popular: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 20,
  },
});

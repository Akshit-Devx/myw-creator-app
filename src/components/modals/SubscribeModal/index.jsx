import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Icons} from '../../../assets/icons';
import {useDispatch, useSelector} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import LinearGradient from 'react-native-linear-gradient';

import {campaignsPlans} from '../../../utility/common';
import {RAZORPAY_KEY} from '../../../config/envConfig';
import {fetchInfluencerById} from '../../../store/slices/onBoarding';
import {fetchSubscription} from '../../../store/slices/subscription';
import {SaveIcon, ShieldIcon, UnlockIcon} from '../../../utility/icons';
import {
  createRazorpayCheckoutAPI,
  createSubscriptionPurchasedAPI,
} from '../../../services/handleApi';

const SubscribeModal = ({
  visible,
  onClose,
  handleKnowMore,
  setPaymentSuccessModal,
  setSubscriptionModal,
}) => {
  const dispatch = useDispatch();
  const {onBoarding} = useSelector(state => state.onBoarding);

  const [btnLoading, setBtnLoading] = useState(false);

  const plan = campaignsPlans.monthly;

  const handleSubscription = useCallback(async () => {
    try {
      setBtnLoading(true);
      const payload = {
        influencerId: onBoarding?.id,
        phone: onBoarding?.phone,
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
      console.error('Error: in handleSubscription', error);
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
          razorpayCustomerId: customerId,
          razorpaySubscriptionId: data?.razorpay_subscription_id,
          isActive: true,
          planId: plan.planId,
          planName: plan.name,
          planPricing: plan.price,
          planInterval: plan.recurring,
        };

        const res = await createSubscriptionPurchasedAPI(payload);
        await dispatch(fetchInfluencerById(onBoarding?.id));
        await dispatch(fetchSubscription(onBoarding?.id));
        setSubscriptionModal(false);
        setTimeout(() => {
          setPaymentSuccessModal(true);
        }, 400);
      } catch (error) {
        console.error('Error: in handlePaymentSuccess', error);
      } finally {
        setBtnLoading(false);
      }
    },
    [
      dispatch,
      onBoarding?.id,
      onBoarding?.phone,
      plan.name,
      plan.planId,
      plan.price,
      plan.recurring,
      setPaymentSuccessModal,
      setSubscriptionModal,
    ],
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      <View
        onPress={handleClose}
        className="flex-1 justify-end items-center bg-black/50">
        <View className="bg-white p-5 rounded-3xl w-full">
          <View
            style={styles.subscribedShadow}
            className="bg-white border-2 border-[#9849ff] w-[80] h-[80] rounded-full justify-center items-center self-center mt-[-60]">
            <Icons.MywallLogoWithName width={60} height={60} />
          </View>
          <TouchableOpacity
            className="self-end"
            disabled={btnLoading}
            onPress={handleClose}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Icons.CrossIcon width={24} height={24} />
          </TouchableOpacity>
          <View className="flex-col gap-3 justify-center items-center">
            <Text className="text-2xl font-bold text-gray-900">
              Subscribe Now to Apply
            </Text>
            <Text className="text-lg text-center font-medium text-gray-700">
              Access to 5000+ Premium Hotels, Salons & Restaurants
            </Text>
          </View>
          <View className="flex-col gap-3 p-4">
            <View className="flex-row items-center gap-3">
              <View className="w-[28] h-[28] bg-[#4701e3db] rounded-full items-center justify-center">
                <UnlockIcon size={16} />
              </View>
              <Text className="text-md text-[#333]">
                Just <Text className="font-semibold">₹299/month</Text>– No Extra
                Charges
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-[28] h-[28] bg-[#4701e3db] rounded-full items-center justify-center">
                <ShieldIcon size={16} />
              </View>
              <Text className="text-md text-[#333]">
                Cancel Anytime – No Lock-ins
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-[28] h-[28] bg-[#4701e3db] rounded-full items-center justify-center">
                <SaveIcon size={16} />
              </View>
              <Text className="text-md text-[#333]">
                Includes Auto-DM, Link-in-Bio & More
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="w-full h-[44] rounded-xl"
            disabled={btnLoading}
            key={btnLoading.toString()}
            onPress={handleSubscription}>
            <LinearGradient
              colors={['#4d32fc', '#9747ff']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradient}>
              {btnLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-xl font-medium">
                  Subscribe Now
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleKnowMore}
            disabled={btnLoading}
            className="self-center my-4">
            <Text className="text-xl text-gray-600">Know More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SubscribeModal;

const styles = StyleSheet.create({
  subscribedShadow: {
    shadowColor: 'rgba(156, 44, 243, 0.36)',
    shadowOffset: {width: 0, height: -2.485},
    shadowRadius: 45.224,
    shadowOpacity: 1,
    elevation: 10,
  },
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
});

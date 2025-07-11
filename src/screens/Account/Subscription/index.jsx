import React, {useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSubscription} from '../../../store/slices/subscription';
import {Icons} from '../../../assets/icons';
import Button from '../../../components/elements/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';
import LinearGradient from 'react-native-linear-gradient';

const SubscriptionsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {onBoarding} = useSelector(state => state.onBoarding);
  const {subscription} = useSelector(state => state.subscription);
  console.log('subscription', subscription);

  const checkSubscriptionStatus = subscription => {
    return Boolean(subscription?.id && subscription?.isActive);
  };

  const isSubscribed = checkSubscriptionStatus(subscription);

  useEffect(() => {
    dispatch(fetchSubscription(onBoarding?.id));
  }, []);

  const formatDate = isoString => {
    return format(new Date(isoString), 'MMMM d, yyyy'); // e.g., July 4, 2025
  };

  const handlePress = () => navigation.goBack();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white p-5">
        <TouchableOpacity
          onPress={handlePress}
          className="p-2 border border-black rounded-xl self-start mb-6">
          <Icons.BackIcon width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-[28px] font-semibold">Subscription</Text>
        <Text className="text-xl text-gray-500 font-semibold my-1">
          Manage your subscription
        </Text>
        <View className="flex-1 mt-20">
          <View className="border-2 border-indigo-500 rounded-full p-2 self-start mx-auto">
            <Icons.MywallLogoWithName width={80} height={80} />
          </View>
          {!subscription?.id ? (
            <View className="flex-col gap-10">
              <View className="flex-col items-center gap-1">
                <Text className="text-2xl font-semibold">
                  No Active Subscription
                </Text>
                <Text className="text-md text-gray-500 mt-2 font-medium text-center">
                  You currently don't have an active plan
                </Text>
                <Text className="text-md text-gray-500 font-medium text-center">
                  Subscribe to unlock premium features and continue enjoying
                  MyWall.
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <Text className="text-xl font-medium text-green-500 self-center mt-8">
                Active
              </Text>
              <Text className="text-2xl font-medium text-center mt-1">
                MyWall {subscription.planName || 'Pro'}
              </Text>
              <View className="flex-row justify-between mt-4">
                <Text className="text-base text-gray-500">Plan Details</Text>
                <Text className="text-base">
                  ₹{subscription.planPricing || 0}/
                  {subscription.planInterval || 'month'}
                </Text>
              </View>
              <View className="flex-row justify-between mt-3">
                <Text className="text-base text-gray-500">Payment Method</Text>
                {subscription.razorpayCustomerId ? (
                  <Icons.Razorpay width={70} height={20} />
                ) : (
                  <Text className="text-base">Stripe</Text>
                )}
              </View>
              <View className="flex-row justify-between mt-3">
                <Text className="text-base text-gray-500">Start Date</Text>
                <Text className="text-base">
                  {subscription.startDate
                    ? formatDate(subscription.startDate)
                    : 'N/A'}
                </Text>
              </View>
              <View className="flex-row justify-between mt-3">
                <Text className="text-base text-gray-500">Next Payment</Text>
                <Text className="text-base">
                  {subscription.endDate
                    ? formatDate(subscription.endDate)
                    : 'N/A'}
                </Text>
              </View>
            </View>
          )}
        </View>
        {/* {!subscription?.id && ( */}
        <View className="absolute bottom-5 left-5 right-5">
          <Button
            title="Subscribe to MyWall"
            size="lg"
            className="h-14 rounded-xl"
            onPress={() => navigation.navigate('Pricing')}
          />
        </View>
        {/* )} */}
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;

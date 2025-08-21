import {useCallback, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import {Icons} from '../../../assets/icons';
import Button from '../../../components/elements/Button';
import {fetchSubscription} from '../../../store/slices/subscription';
import {checkSubscriptionStatus, formatDate} from '../../../utility/helper';
import DetailStackHeader from '../../../components/common/DetailStackHeader';

const SubscriptionInfo = ({subscription, isSubscribed, onSubscribeClick}) => {
  return (
    <View className="">
      <View className="flex-col gap-1 mb-8">
        <Text className="text-xl font-semibold text-gray-900">
          Subscription
        </Text>
        <Text className="text-lg font-medium text-gray-500">
          Manage your subscription
        </Text>
      </View>
      {subscription && isSubscribed ? (
        <View className="flex-col gap-10">
          <View
            style={styles.subscribedShadow}
            className="border-2 bg-white border-indigo-500 rounded-full p-2 self-start mx-auto">
            <Icons.MywallLogoWithName width={80} height={80} />
          </View>
          <View className="flex-col items-center gap-1">
            <Text className="text-lg font-medium text-[#00A822]">Active</Text>
            <Text className="text-2xl text-gray-900 font-bold">
              MyWall {subscription.planName || 'Pro'}
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-col gap-8">
          <View className="flex-col gap-14">
            <View
              style={styles.unsubscribedShadow}
              className="border border-indigo-500 bg-white rounded-full p-2 self-start mx-auto">
              <Icons.MywallLogoWithName width={80} height={80} />
            </View>
            <View className="flex-col gap-6">
              {!isSubscribed && subscription?.endDate && (
                <View className="w-full py-3 bg-[#fff3f3] items-center justify-center rounded-md border border-[#fcc]">
                  <Text className="text-[#ba0000] text-md font-normal">{`Subscription expired on ${formatDate(
                    subscription?.endDate,
                  )}`}</Text>
                </View>
              )}
              <View className="bg-[#f1f5f9] p-4 rounded-lg justify-center items-center flex-col gap-3">
                <Icons.InfoIcon width={20} height={20} />
                <Text className="text-md text-gray-500 text-center font-medium">
                  {isSubscribed
                    ? 'Your plan is currently active.'
                    : "You don't have an active subscription. Subscribe now to unlock premium features and enjoy a seamless experience on MyWall."}
                </Text>
              </View>
            </View>
          </View>
          <View className="">
            <Button
              onPress={onSubscribeClick}
              title="Subscribe to MyWall"
              size="lg"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const SubscriptionPeriod = ({endDate, planPricing, planInterval}) => {
  if (!endDate || !planPricing || !planInterval) return null;

  return (
    <View className="flex-col justify-center items-center p-6 bg-[#f1f5f9] rounded-xl">
      <View className="justify-center items-center rounded-lg mb-3">
        <Icons.InfoIcon width={20} height={20} />
      </View>
      <Text className="text-center text-base font-medium">
        Your trial will end on{' '}
        <Text className="font-semibold">{formatDate(endDate)}</Text>
      </Text>
      <Text className="text-center text-sm font-medium">
        After that, you will be automatically billed{' '}
        <Text className="font-semibold">
          ₹{planPricing}/{planInterval}
        </Text>
      </Text>
    </View>
  );
};

const PaymentInfo = ({subscription}) => {
  if (!subscription) return null;

  return (
    <View className="flex-col gap-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-medium">Plan Details</Text>
        <Text className="text-sm text-gray-800 font-semibold">
          ₹{subscription.planPricing || 0}/
          {subscription.planInterval || 'month'}
        </Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-medium">Payment Method</Text>
        {subscription.razorpayCustomerId ? (
          <View className="w-24 h-6">
            <Icons.RazorpayIcon width={'100%'} height={'100%'} />
          </View>
        ) : (
          <Text className="text-sm font-medium">Razorpay</Text>
        )}
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-medium">Start Date</Text>
        <Text className="text-sm text-gray-800 font-medium">
          {subscription.startDate
            ? formatDate(subscription.startDate)
            : formatDate(subscription?.createdAt || 'N/A')}
        </Text>
      </View>
      <View className="flex flex-row justify-between items-center">
        <Text className="text-sm font-medium">Next Payment</Text>
        <Text className="text-sm text-gray-800 font-medium">
          {subscription.endDate
            ? formatDate(subscription.endDate)
            : formatDate(
                new Date(
                  new Date(subscription?.createdAt).getTime() +
                    30 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              ) || 'N/A'}
        </Text>
      </View>
    </View>
  );
};

const SubscriptionsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {onBoarding} = useSelector(state => state.onBoarding);
  const {subscription} = useSelector(state => state.subscription);

  const isSubscribed = checkSubscriptionStatus(subscription);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchSubscription(onBoarding?.id));
    }, [dispatch, onBoarding?.id]),
  );

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Subscription"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <View className="p-5 flex-1 flex-col gap-8">
        <SubscriptionInfo
          subscription={subscription}
          isSubscribed={isSubscribed}
          onSubscribeClick={() =>
            navigation.navigate('Detail', {
              screen: 'Pricing',
            })
          }
        />
        {isSubscribed && subscription && (
          <>
            <SubscriptionPeriod
              endDate={subscription.endDate}
              planPricing={subscription.planPricing}
              planInterval={subscription.planInterval}
            />
            <PaymentInfo subscription={subscription} />
          </>
        )}
        {isSubscribed && subscription?.planInterval === 'month' && (
          <View className="mt-10">
            <Button
              title="Switch to Annual"
              onPress={() =>
                navigation.navigate('Detail', {
                  screen: 'Pricing',
                  params: {planInterval: 'year'},
                })
              }
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  subscribedShadow: {
    shadowColor: 'rgba(156, 44, 243, 0.36)',
    shadowOffset: {width: 0, height: -2.485},
    shadowRadius: 45.224,
    shadowOpacity: 1,
    elevation: 10,
  },
  unsubscribedShadow: {
    shadowColor: '#9DB2CE',
    shadowOffset: {width: 0, height: -2.485},
    shadowRadius: 45.224,
    shadowOpacity: 1,
    elevation: 10,
  },
});

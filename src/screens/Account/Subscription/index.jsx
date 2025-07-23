import {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSubscription} from '../../../store/slices/subscription';
import {Icons} from '../../../assets/icons';
import Button from '../../../components/elements/Button';

const SubscriptionsScreen = () => {
  const dispatch = useDispatch();
  const {onBoarding} = useSelector(state => state.onBoarding);
  const {subscription} = useSelector(state => state.subscription);
  console.log('subscription', subscription);

  useEffect(() => {
    dispatch(fetchSubscription(onBoarding?.id));
  }, []);

  return (
    <View className="flex-1 bg-white p-5">
      {!subscription?.id && (
        <View className="flex-col gap-10">
          <View className="border-2 border-indigo-500 rounded-full p-2 self-start mx-auto">
            <Icons.MywallLogoWithName width={80} height={80} />
          </View>
          <View className="flex-col items-center gap-1">
            <Text className="text-2xl font-semibold">
              No Active Subscription
            </Text>
            <Text className="text-md text-gray-500 mt-2 font-medium text-center">
              You currently don't have an active plan
            </Text>
            <Text className="text-md text-gray-500 font-medium text-center">
              Subscribe to unlock premium features and continue enjoying MyWall.
            </Text>
          </View>
        </View>
      )}
      {!!subscription?.id && (
        <View>
          <View className="border border-indigo-500 rounded-full p-2 self-start mx-auto">
            <Icons.MywallLogoWithName width={80} height={80} />
          </View>
          <Text>{subscription?.isActive ? 'Active' : 'Inactive'}</Text>
          <Text>MyWall {subscription?.planName || 'Pro'}</Text>
        </View>
      )}
      <View className="absolute bottom-5 left-5 right-5">
        <Button title="Subscribe Now" size="lg" />
      </View>
    </View>
  );
};

export default SubscriptionsScreen;

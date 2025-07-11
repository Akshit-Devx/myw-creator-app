import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icons} from '../../../assets/icons';
import {campaignsPlans} from './Plans';
import {useDispatch, useSelector} from 'react-redux';
import {
  createRazorpayCheckoutAPI,
  createSubscriptionPurchasedAPI,
} from '../../../services/handleApi';
import Config from 'react-native-config';
import {fetchSubscription} from '../../../store/slices/subscription';
import RazorpayCheckout from 'react-native-razorpay';
import PaymentSuccessModal from '../../../components/Pricing/PaymentSuccessModal';

const Pricing = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [plan, setPlan] = useState(campaignsPlans.monthly);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isPaymentSuccessModal, setPaymentSuccessModal] = useState(true);

  const {onBoarding} = useSelector(state => state.onBoarding);
  const {subscription} = useSelector(state => state.subscription);

  const dispatch = useDispatch();

  const isSubscribed = subscription?.id && subscription?.isActive;
  const currentPlanInterval = subscription?.planInterval;

  useEffect(() => {
    setPlan(isAnnual ? campaignsPlans.yearly : campaignsPlans.monthly);
  }, [isAnnual]);

  const plans = [
    {
      id: 'monthly',
      title: '₹299 / month',
      subtitle: 'Monthly Subscription',
      price: 299,
      monthlyEquivalent: 299,
    },
    {
      id: 'yearly',
      title: '₹249 / month',
      subtitle: '₹2,999 Yearly Subscription',
      original: '₹299',
      badge: 'Popular',
      price: 2999,
      monthlyEquivalent: 249,
    },
  ];

  const getButtonText = () => {
    if (!isSubscribed) return 'Subscribe now';

    if (currentPlanInterval === 'month') {
      return isAnnual ? 'Upgrade to Annual plan' : 'Already Subscribed';
    } else if (currentPlanInterval === 'year') {
      return !isAnnual ? 'Switch to Monthly plan' : 'Already Subscribed';
    }

    return 'Subscribe now';
  };

  const handlePaymentSuccess = async (data, customerId) => {
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
      console.log('payload of createSubscriptionPurchasedAPI ::: ', payload);
      await createSubscriptionPurchasedAPI(payload);
      dispatch(fetchSubscription(onBoarding?.id));
      // setPaymentSuccessModal(true);
      Alert.alert('Payment success');
      setPaymentSuccessModal(true);
      console.log('success ::: ');
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSubscribe = async () => {
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

      console.log('response ::: ', response);

      const options = {
        key: Config.RAZORPAY_KEY,
        // subscription_id: response.session,
        name: 'My Wall',

        amount: plan.price * 100,

        // image: 'http://mywall-master.b-cdn.net/public/brandLogo/mywallIcon.jpg',
        description: 'Monthly Subscription',
        currency: 'INR',

        prefill: {
          contact: onBoarding?.phone,
        },
        // readonly: {
        //   email: true,
        //   contact: true,
        // },
        // hidden: {
        //   contact: true,
        //   email: true,
        // },
        theme: {
          color: '#1677ff',
        },
      };

      try {
        await RazorpayCheckout.open(options)
          .then(async res => {
            console.log('res of razorpay', res);
            try {
              await handlePaymentSuccess(res, response?.customerId);
            } catch (error) {
              console.log('error of RazorpayCheckout res ::: ', error);
            }
          })
          .catch(error => {
            console.log('error razorpay', error);
          });

        console.log('payload ::: ', options);
      } catch (error) {
        console.log('error here ::: ', error);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      console.log('LLL::::');

      setBtnLoading(false);
    }
  };

  const renderPlansFeatures = ({item, index}) => {
    return (
      <View
        key={index}
        className="border-b border-[#2d2b3a] py-3 flex-row items-start mt-4">
        <Text className="text-white font-semibold text-[16px] pl-2  flex-1">
          {item?.label}
        </Text>
      </View>
    );
  };

  const renderPlanItem = ({item}) => {
    const isSelected = selectedPlan === item.id;

    const onPressPlan = plan => () => {
      setSelectedPlan(plan.id);
      setIsAnnual(!isAnnual);
    };

    return (
      <TouchableOpacity
        onPress={onPressPlan(item)}
        className={`relative rounded-xl px-4 py-4 mb-4 ${
          isSelected
            ? 'bg-[#1a1a2e] border border-[#9747ff]'
            : 'bg-[#11101a] border border-[#444]'
        }`}>
        {item.badge && (
          <View className="absolute top-0 right-0 rounded-bl-xl overflow-hidden">
            <LinearGradient
              colors={['#7a4bff', '#a663ff']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              className="px-4 py-[6px]">
              <Text className="text-white text-xs font-semibold py-[6px] px-2">
                Popular
              </Text>
            </LinearGradient>
          </View>
        )}

        {item.id === 'yearly' ? (
          <>
            <View className="flex-row items-baseline space-x-2">
              <Text className="text-gray-400 text-[14px] line-through">
                {item.original}
              </Text>
              <Text className="text-white text-[18px] font-bold">
                {` ${item.title}`}
              </Text>
            </View>
            <Text className="text-gray-300 text-[13px] mt-1">
              {item.subtitle}
            </Text>
          </>
        ) : (
          <>
            <Text className="text-white text-[16px] font-semibold">
              {item.title}
            </Text>
            <Text className="text-gray-400 text-[14px]">{item.subtitle}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1720]">
      <LinearGradient
        colors={['#1a1720', '#1a1329']}
        start={{x: 0.3, y: 0}}
        end={{x: 1, y: 1}}
        className="flex-1 px-4 pt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-white text-[16px] pl-2 mb-4">← Back</Text>
        </TouchableOpacity>
        <View className="px-3" style={{height: '63%'}}>
          <View className="items-center -mb-14 z-10">
            <View className="w-[90px] h-[90px] rounded-full bg-white border-2 border-[#9849ff] overflow-hidden items-center justify-center ">
              <Icons.MywallLogoWithName height={60} width={60} />
            </View>
          </View>
          <View className="bg-[#1a1720] border border-[#00e5ff] border-t-[5px] border-t-[#9849ff] rounded-2xl pt-20 pb-6 px-4">
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              nestedScrollEnabled={true}>
              <Text className="text-white text-center font-bold text-[24px] mb-6 ">
                All with One Simple Monthly Subscription
              </Text>
              <FlatList
                data={plan.features}
                renderItem={renderPlansFeatures}
                keyExtractor={item => item.id}
                nestedScrollEnabled={true}
              />
            </ScrollView>
          </View>
        </View>
        <View className="mt-6 bg-[#1a1720] relative">
          <FlatList
            data={plans}
            keyExtractor={item => item.id}
            renderItem={renderPlanItem}
            scrollEnabled={false}
          />
        </View>
        <TouchableOpacity
          className="rounded-full overflow-hidden mt-4 mx-6"
          disabled={
            isSubscribed &&
            ((currentPlanInterval === 'month' && !isAnnual) ||
              (currentPlanInterval === 'year' && isAnnual))
          }
          onPress={handleSubscribe}>
          <LinearGradient
            colors={['#7a4bff', '#a663ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            className="px-4 py-[12px] flex-row justify-center items-center">
            <View className=" z-10">
              {btnLoading ? (
                <ActivityIndicator
                  size="large"
                  color="white"
                  className="py-[8px]"
                />
              ) : (
                <Text className="text-white text-2xl font-semibold py-[12px] px-2 text-center">
                  {getButtonText()}
                </Text>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
      <PaymentSuccessModal
        onClose={() => setPaymentSuccessModal(false)}
        isOpen={isPaymentSuccessModal}
      />
    </SafeAreaView>
  );
};

export default Pricing;

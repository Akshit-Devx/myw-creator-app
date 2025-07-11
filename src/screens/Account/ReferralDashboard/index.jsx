import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icons} from '../../../assets/icons';
import {useDispatch, useSelector} from 'react-redux';
import {getInfluencerByIdAPI} from '../../../services/handleApi';
import {fetchReferralByInfluencerId} from '../../../store/slices/referralSlice';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';
import {getInfluencerMediaURL} from '../../../utility/helper';

const ReferralDashboard = ({navigation}) => {
  const handlePress = () => navigation.goBack();

  const {onBoarding} = useSelector(state => state.onBoarding);
  const {referrals} = useSelector(state => state.referral);

  const [sortedReferral, setSortedReferral] = useState([]);
  const [referredUsers, setReferredUsers] = useState([]);

  useEffect(() => {
    console.log('referrals ::: ', referrals);

    if (referrals?.id) {
      const sortedReferrals = [...referrals.listOfReferrals].sort((a, b) => {
        return (
          new Date(b.bonusDate).getTime() - new Date(a.bonusDate).getTime()
        );
      });
      console.log('sortedReferrals ::: ', sortedReferrals);

      setSortedReferral(sortedReferrals);

      // fetchInfluencersData();
    }
  }, [referrals]);

  const fetchInfluencersData = async () => {
    try {
      console.log('sortedReferral ::: ', sortedReferral);

      const promises = sortedReferral.map(async item => {
        return await getInfluencerByIdAPI(item.influencerId);
      });

      const data = await Promise.all(promises);

      console.log('data ::: ', data);

      const combinedData = sortedReferral.map((referralItem, index) => {
        const influencerData = data[index];

        return {
          email: influencerData.email,
          name: influencerData.name,
          profilePic: influencerData.profilePictureWithoutBg,
          bonus: referralItem.bonus,
          bonusDate: referralItem.bonusDate,
        };
      });
      setReferredUsers(combinedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (sortedReferral.length > 0) {
      fetchInfluencersData(); // Now it uses updated state
    }
  }, [sortedReferral]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReferralByInfluencerId(onBoarding?.id));
  }, []);

  console.log('referredUsers :: ', referredUsers);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <TopNav />
      <ScrollView className="flex-1 bg-white p-5" bounces={false}>
        <TouchableOpacity
          onPress={handlePress}
          className="p-2 border border-black rounded-xl self-start mb-6">
          <Icons.BackIcon width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-[28px] font-semibold mb-6">
          Referral Dashboard
        </Text>
        <View className="bg-[#0D0C2D] rounded-2xl p-4 mb-6">
          <Text className="text-white text-base mb-2">
            Withdrawable Earnings
          </Text>
          <Text className="text-white text-3xl font-bold mb-4">
            ₹ {referrals?.currentWalletBalance ?? 0}
          </Text>

          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-row items-center justify-center bg-[#4D4C69] px-4 py-3 rounded-lg flex-1"
              onPress={() => navigation.navigate('WithdrawEarning')}>
              {/* <Icon name="arrow-down-circle" size={18} color="white" /> */}
              <Text className="text-white font-semibold ml-2">Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-[#4D4C69] px-4 py-3 rounded-lg flex-1 items-center"
              onPress={() => navigation.navigate('WithdrawalHistory')}>
              <Text className="text-white font-semibold">History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview */}
        <Text className="text-2xl font-semibold text-black mb-3">Overview</Text>
        <View className=" border border-gray-300 rounded-xl p-3">
          <Text className="text-black text-sm">💰 Earnings</Text>
          <Text className="text-black font-semibold mt-1">
            ₹ {referrals?.totalEarnings || '0'}
          </Text>
        </View>

        <View className="flex-row justify-between my-4">
          <View className="flex-row flex-1">
            <View className="flex-1 border border-gray-300 rounded-xl p-3 ">
              <Text className="text-black text-sm">👥 Referred Users</Text>
              <Text className="text-black font-semibold mt-1">
                {referrals?.listOfReferrals?.length ?? 0}
              </Text>
            </View>
            <View className="flex-1 border border-gray-300 rounded-xl p-3 ml-4">
              <Text className="text-black text-sm">🕒 Sign Ups</Text>
              <Text className="text-black font-semibold mt-1">
                {referrals?.listOfReferrals?.length ?? 0}
              </Text>
            </View>
          </View>
        </View>
        {/* </View> */}

        {/* Referred Users Table Header */}
        <Text className="text-2xl font-semibold text-black mb-2">
          Referred users
        </Text>

        <View className="flex-row justify-between bg-gray-100 px-3 py-2 rounded-md">
          <Text className="text-gray-700 text-lg font-semibold">Users</Text>
          <Text className="text-gray-700 text-lg font-semibold">Earnings</Text>
        </View>
        <View className="gap-4 mt-2">
          {referredUsers?.slice(0, 5)?.map(user => {
            return (
              <View className="flex-row justify-between px-3 py-2 items-center">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{
                      uri: getInfluencerMediaURL(user?.profilePic),
                    }}
                    className="h-12 w-12 rounded-full"
                  />
                  <Text className="text-gray-900 text-xl font-medium">
                    {user?.name}
                  </Text>
                </View>
                <Text className="text-green-700 text-xl font-semibold">
                  +₹{user?.bonus}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralDashboard;

const styles = StyleSheet.create({});

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../../../components/common/FullScreenLoader';
import {
  getInfluencerByIdAPI,
  getReferralTrackingByInfluencerIdAPI,
} from '../../../../services/handleApi';
import {getMediaURL} from '../../../../utility/helper';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';

const ReferrralDashboardScreen = () => {
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchReferralData();
    }, [fetchReferralData]),
  );

  const fetchReferralData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReferralTrackingByInfluencerIdAPI(
        onBoarding?.id,
      );
      let listOfReferrals = response?.listOfReferrals || [];

      listOfReferrals.sort(
        (a, b) =>
          new Date(b?.referredDate).getTime() -
          new Date(a?.referredDate).getTime(),
      );

      const enrichedReferrals = await Promise.all(
        listOfReferrals.map(async referral => {
          try {
            const influencer = await getInfluencerByIdAPI(
              referral?.influencerId,
            );
            return {
              ...referral,
              name: influencer?.name || '',
              profilePictureWithBg: influencer?.profilePictureWithBg || '',
            };
          } catch (err) {
            console.error(
              `Failed to fetch influencer for ID ${referral?.influencerId}`,
              err,
            );
            return {
              ...referral,
              name: '',
              profilePic: '',
            };
          }
        }),
      );

      setReferralData({...response, listOfReferrals: enrichedReferrals});
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [onBoarding?.id]);

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Referral Dashboard"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-white">
        {loading && <FullScreenLoader visible={loading} />}
        <View className="flex-col gap-4 p-5">
          <View className="flex-col gap-3 bg-blue-950 p-5 rounded-xl">
            <Text className="text-white">Withdrawalable Earnings</Text>
            <Text className="text-white font-bold text-2xl">
              ₹ {referralData?.currentWalletBalance || '0'}
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Detail', {
                    screen: 'Withdraw',
                  })
                }
                className="bg-white py-2 px-4 w-[48%] rounded-md">
                <Text className="text-center">Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Detail', {
                    screen: 'WithdrawalHistory',
                  })
                }
                className="bg-white py-2 px-4 w-[48%] rounded-md">
                <Text className="text-center">History</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-col gap-3">
            <Text className="text-2xl font-medium">Overview</Text>
            <View className="border border-gray-200 p-3 rounded-md">
              <Text className="text-lg font-medium">Earnings</Text>
              <Text className="text-xl font-bold">
                ₹ {referralData?.totalEarnings || '0'}
              </Text>
            </View>
            <View className="flex-row gap-3">
              <View className="border w-[48%] border-gray-200 p-3 rounded-md">
                <Text className="text-lg font-medium">Referred Users</Text>
                <Text className="text-xl font-bold">
                  {referralData?.listOfReferrals?.length || '0'}
                </Text>
              </View>
              <View className="border w-[48%] border-gray-200 p-3 rounded-md">
                <Text className="text-lg font-medium">Sign Ups</Text>
                <Text className="text-xl font-bold">
                  {referralData?.listOfReferrals?.length || '0'}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-col gap-3">
            <Text className="text-2xl font-medium">Referred Users</Text>
            <View className="flex-col gap-4">
              <View className="flex-row gap-3 bg-gray-200 justify-between py-2 px-4 rounded-md">
                <Text>Users</Text>
                <Text>Earnings</Text>
              </View>
              {referralData?.listOfReferrals?.map((item, index) => (
                <View
                  key={index}
                  className="flex-row gap-3 items-center justify-between px-4">
                  <View className="flex-row gap-3 items-center">
                    <Image
                      source={{uri: getMediaURL(item?.profilePictureWithBg)}}
                      className="w-12 h-12 rounded-full"
                    />
                    <Text
                      className="font-medium text-lg w-[70%]"
                      numberOfLines={1}>
                      {item?.name}
                    </Text>
                  </View>
                  <Text className="text-green-600 text-lg font-medium">
                    ₹ {item?.bonus}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReferrralDashboardScreen;

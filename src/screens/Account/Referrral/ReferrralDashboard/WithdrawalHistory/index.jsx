import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../../../../components/common/FullScreenLoader';
import {getReferralTrackingByInfluencerIdAPI} from '../../../../../services/handleApi';
import {convertToTitleCase, formatDate} from '../../../../../utility/helper';

const statusStyles = {
  INITIATED: {
    text: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  SUCCESS: {
    text: 'text-green-600',
    bg: 'bg-green-100',
  },
  FAILED: {
    text: 'text-red-600',
    bg: 'bg-red-100',
  },
};

const WithdrawalHistoryScreen = () => {
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
      setReferralData(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [onBoarding?.id]);

  return (
    <View className="flex-1 flex-col gap-4 bg-white p-5">
      {loading && <FullScreenLoader visible={loading} />}

      {!referralData?.withdrawalHistroy?.length && !loading && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-medium">No withdrawal history</Text>
        </View>
      )}

      {!!referralData?.withdrawalHistroy?.length &&
        !loading &&
        referralData?.withdrawalHistroy?.map((item, index) => {
          const payoutMethod = referralData?.payoutMethods?.find(
            payout => payout.id === item.payoutMethodId,
          );
          return (
            <View
              key={index}
              className="flex-row justify-between items-center border-b border-gray-200 pb-3">
              <View className="flex-row items-center gap-4">
                <Text className="text-lg font-medium border border-gray-200 p-2 rounded-md">
                  {payoutMethod?.methodName}
                </Text>
                <View className="flex-col gap-1">
                  <Text
                    className={`text-lg font-medium ${
                      statusStyles[item?.status]?.text
                    } ${
                      statusStyles[item?.status]?.bg
                    } py-0.5 px-2 text-center rounded-md`}>
                    {convertToTitleCase(item?.status)}
                  </Text>
                  <Text className="text-gray-500 font-medium">
                    {formatDate(item?.createdAt)}
                  </Text>
                </View>
              </View>

              <Text
                className={`${statusStyles[item?.status]?.text} font-medium`}>
                +₹{item?.amount}
              </Text>
            </View>
          );
        })}
    </View>
  );
};

export default WithdrawalHistoryScreen;

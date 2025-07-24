import {useEffect, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import Button from '../../../../../components/elements/Button';
import {getReferralTrackingByInfluencerIdAPI} from '../../../../../services/handleApi';
import {useNavigation} from '@react-navigation/native';

const WithdrawScreen = () => {
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
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
  };

  return (
    <View className="flex-1 flex-col gap-5 bg-white p-5">
      <View className="flex-col gap-4">
        <Text className="text-lg font-semibold text-center">
          Available Balance: ₹ {referralData?.currentWalletBalance || '0'}
        </Text>
        <TextInput
          value={amount}
          onChangeText={value => {
            const numericValue = value.replace(/[^0-9]/g, '');
            setAmount(numericValue);
          }}
          placeholder="₹0"
          keyboardType="numeric"
          className="border-b border-gray-200 text-4xl font-semibold text-center p-3"
        />
        <Text className="text-center text-gray-500">
          Minimum amount must be ₹100
        </Text>
      </View>
      <View className="flex-col gap-2 mt-4">
        <Text className="text-xl font-medium">Payout Method</Text>
        <View>
          {!referralData?.payoutMethods?.length && (
            <View className="bg-gray-100 p-3 rounded-md">
              <Text className="text-center text-gray-500">
                No payout method added
              </Text>
            </View>
          )}
        </View>
        <Button
          variant="secondary"
          title="Add New"
          className="w-full border-gray-200"
          textClassName="text-blue-600"
          onPress={() =>
            navigation.navigate('Detail', {screen: 'PayoutMethod'})
          }
        />
      </View>
      <Button title="Request Withdrawal" onPress={() => {}} />
      <Button
        variant="secondary"
        title="View Recent Withdrawals"
        className="w-full border-gray-200"
        textClassName="text-black"
        onPress={() =>
          navigation.navigate('Detail', {screen: 'WithdrawalHistory'})
        }
      />
    </View>
  );
};

export default WithdrawScreen;

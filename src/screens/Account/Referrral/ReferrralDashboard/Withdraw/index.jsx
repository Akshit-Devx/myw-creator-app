import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../../../../components/common/FullScreenLoader';
import Button from '../../../../../components/elements/Button';
import {
  createWithdrawRequestAPI,
  getReferralTrackingByInfluencerIdAPI,
} from '../../../../../services/handleApi';

const WithdrawScreen = () => {
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(null);
  const [amount, setAmount] = useState('');

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

  const maskPayoutValue = item => {
    if (item?.bankAccountNumber) {
      const acc = item.bankAccountNumber.toString();
      const visible = acc.slice(-4);
      const masked = '*'.repeat(acc.length - 4);
      return `${masked}${visible}`;
    }

    if (item?.upiId) {
      const [prefix, domain] = item.upiId.split('@');
      if (prefix && domain) {
        const maskedPrefix = `${prefix.charAt(0)}****`;
        return `${maskedPrefix}@${domain}`;
      }
      return '****';
    }

    return '';
  };

  const handleWithdrawal = async () => {
    setBtnLoading(true);
    try {
      const numericAmount = parseInt(amount, 10);

      if (!numericAmount || numericAmount < 100) {
        Alert.alert('Withdrawal amount must be at least ₹100.');
        return;
      }

      if (!selectedPayoutMethod?.id) {
        Alert.alert('Please select a payout method.');
        return;
      }

      if (numericAmount > referralData?.currentWalletBalance) {
        Alert.alert('Withdrawal amount cannot exceed available balance.');
        return;
      }

      const payload = {
        referralId: referralData?.id,
        amount: numericAmount,
        payoutMethodId: selectedPayoutMethod?.id,
      };
      const response = await createWithdrawRequestAPI(payload);
      if (response?.code === 'SUCCESS') {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return <FullScreenLoader visible={loading} />;
  }

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
          {!!referralData?.payoutMethods?.length && (
            <View className="flex-col gap-2">
              {referralData?.payoutMethods
                ?.filter(item => !item?.isArchived)
                ?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPayoutMethod(item)}
                    className={`flex-row items-center justify-between p-3 border rounded-md ${
                      selectedPayoutMethod?.id === item?.id
                        ? 'border-blue-600'
                        : 'border-gray-200'
                    }`}>
                    <View className="flex-col gap-1">
                      <Text className="text-gray-500">{item?.methodName}</Text>
                      <Text className="text-lg font-medium">
                        {maskPayoutValue(item)}
                      </Text>
                    </View>
                    <Button
                      className="w-12"
                      variant="ghost"
                      title="Edit"
                      onPress={() =>
                        navigation.navigate('Detail', {
                          screen: 'PayoutMethod',
                          params: {
                            referralData,
                            selectedPayoutMethod: item,
                            mode: 'EDIT',
                          },
                        })
                      }
                    />
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </View>
      <View className="flex-col gap-3">
        <Button
          variant="secondary"
          title="Add New"
          className="w-full border-gray-200"
          textClassName="text-blue-600"
          onPress={() =>
            navigation.navigate('Detail', {
              screen: 'PayoutMethod',
              params: {
                referralData,
                mode: 'ADD',
              },
            })
          }
        />
        <Button
          title="Request Withdrawal"
          loading={btnLoading}
          onPress={handleWithdrawal}
        />
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
    </View>
  );
};

export default WithdrawScreen;

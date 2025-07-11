import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icons} from '../../../assets/icons';
import Button from '../../../components/elements/Button';
import {useDispatch, useSelector} from 'react-redux';
import {createWithdrawalRequest} from '../../../services/handleApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';
import {methods} from './payoutMethods';
import ToastMessage from '../../../components/Toast/Toast';
import {fetchReferralByInfluencerId} from '../../../store/slices/referralSlice';

const WithdrawEarning = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);

  const {referrals} = useSelector(state => state.referral);
  const {onBoarding} = useSelector(state => state.onBoarding);
  const dispatch = useDispatch();

  const [toast, setToast] = useState({
    toastDisplay: '',
    toastMessage: '',
    toastType: '',
  });

  console.log('referrals nat withdraw ::: ', referrals);

  const handlePress = () => navigation.goBack();

  const activeMethods = referrals?.payoutMethods?.filter(
    item => !item.isArchived,
  );

  const showToast = (message, type) => {
    setToast({
      toastDisplay: Date.now().toString(),
      toastMessage: message,
      toastType: type,
    });
  };

  const handleWithdrawClick = async () => {
    console.log('handleWithdrawClick called');

    // setLoading(true);
    try {
      const numericValue = amount?.replace('₹', '');
      // const numericValue = parseFloat(amount.replace(/[^0-9.]/g, ''));
      // console.log('numericValue ::: ', numericValue);

      if (isNaN(numericValue) || numericValue <= 0) {
        console.log('numericValue 1 :::', numericValue);

        showToast('Please enter a valid amount.', 'error');
      } else if (numericValue > referrals?.currentWalletBalance) {
        showToast(
          'Unable to request withdrawal. Insufficient balance.',
          'error',
        );
        console.log('numericValue 2 :::', numericValue);
      } else if (numericValue < 100) {
        console.log('numericValue 3 :::', numericValue);
        showToast(
          'Unable to request withdrawal. Minimum withdrawal amount must be ₹100.',
          'error',
        );
      } else if (!selectedMethod) {
        console.log('selectedMethod ::: ', selectedMethod);

        showToast(
          'Please select your payout method to continue with the withdrawal.',
          'error',
        );
      } else {
        const payload = {
          referralId: referrals?.id,
          amount: numericValue?.replace('₹', ''),
          payoutMethodId: selectedMethod,
        };
        console.log('payload ::: ', payload);

        const res = await createWithdrawalRequest(payload);
        console.log('res of createWithdrawalRequest ::: ', res);
        dispatch(fetchReferralByInfluencerId(onBoarding?.id));

        // router.push('/configure/wallet/dashboard');
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    console.log('item.methodName ::: ', item.methodName);

    const method = methods?.find(method => method.name === item.methodName);
    const isSelected = selectedMethod === item.id;
    const IconComponent = Icons[method.name];

    return (
      <TouchableOpacity
        onPress={() => setSelectedMethod(item.id)}
        className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${
          isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
        }`}>
        <View className="flex-row items-center gap-3">
          <IconComponent />
          <View>
            <Text className="text-base font-semibold text-black">
              {method.name}
            </Text>
            {item.upiId && (
              <Text className="text-gray-600 text-sm">{item.upiId}</Text>
            )}
            {item.bankAccountNumber && (
              <Text className="text-gray-600 text-sm">
                {item.bankAccountNumber}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditPayoutMethod', {methodId: item.id})
          }
          className="px-4 py-2 rounded-md ">
          <Text className="text-sm font-medium text-blue-600">Edit</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <TopNav />
      <View className="flex-1 bg-white p-5">
        <TouchableOpacity
          onPress={handlePress}
          className="p-2 border border-black rounded-xl self-start mb-6">
          <Icons.BackIcon width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-[28px] font-semibold">Withdraw Earnings</Text>
        <Text className="text-lg font-medium text-center text-black mb-2 mt-10">
          Available Balance: ₹ {referrals?.currentWalletBalance || '0'}
        </Text>

        {/* Input for amount */}
        <TextInput
          className="text-4xl font-bold text-center text-black mt-8"
          placeholder="₹0"
          placeholderTextColor="#000"
          keyboardType="numeric"
          onChangeText={text => {
            const numeric = text.replace(/[^\d]/g, ''); // keep only digits
            setAmount(numeric ? `₹${numeric}` : '');
          }}
          value={amount}
          maxLength={6}
        />
        {/* Divider */}
        <View className="border-t border-gray-200 my-2" />

        {/* Minimum Note */}
        <Text className="text-center text-gray-500 mb-6">
          Minimum amount must be ₹100
        </Text>

        {/* Payout Method */}
        <Text className="text-base font-semibold text-black mb-2">
          Payout Method
        </Text>

        {!!referrals?.payoutMethods?.length ? (
          <View>
            <FlatList
              data={activeMethods}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={renderItem}
              scrollEnabled
              contentContainerStyle={{
                paddingVertical: 12,
              }}
            />
          </View>
        ) : (
          <View className="bg-gray-100 rounded-xl p-4">
            <Text className="text-gray-500">No payout methods added.</Text>
          </View>
        )}

        <Button
          title={'Add New'}
          variant="secondary"
          onPress={() => {
            navigation.navigate('AddPayoutMethod');
          }}
          className="rounded-xl border-gray-200 h-12"
          textClassName="text-blue-600 text-lg"
        />
        <Button
          title={'Request Withdrawal'}
          variant="primary"
          onPress={handleWithdrawClick}
          className="rounded-xl border-gray-200 h-12 mt-6"
          textClassName="text-blue-600 text-lg"
        />
        <Button
          title={'View Recent Withdrawals'}
          variant="secondary"
          onPress={() => navigation.navigate('WithdrawalHistory')}
          className="rounded-xl border-gray-300 h-12 mt-6"
          textClassName="text-lg font-normal text-gray-900"
        />
      </View>
      {toast?.toastDisplay && (
        <ToastMessage
          toastDisplay={toast?.toastDisplay}
          toastMessage={toast?.toastMessage}
          toastType={toast?.toastType}
        />
      )}
    </SafeAreaView>
  );
};

export default WithdrawEarning;

const styles = StyleSheet.create({});

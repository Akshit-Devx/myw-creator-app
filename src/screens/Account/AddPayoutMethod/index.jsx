import React, {use, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import {Icons} from '../../../assets/icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';
import ToastMessage from '../../../components/Toast/Toast';
import {updateReferralData} from '../../../services/handleApi';
import {useDispatch, useSelector} from 'react-redux';
import {fetchReferralByInfluencerId} from '../../../store/slices/referralSlice';

const methods = [
  {
    id: 1,
    name: 'UPI',
    image: Icons.UPI,
  },
  {
    id: 2,
    name: 'BANK',
    image: Icons.Bank,
  },
];

const AddPayoutMethod = ({}) => {
  const {referrals} = useSelector(state => state.referral);
  const {onBoarding} = useSelector(state => state.onBoarding);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    payoutMethod: 'UPI',
    upiId: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    beneficiaryName: '',
  });

  const [toast, setToast] = useState({
    toastDisplay: '',
    toastMessage: '',
    toastType: '',
  });

  const showToast = (message, type) => {
    setToast({
      toastDisplay: Date.now().toString(),
      toastMessage: message,
      toastType: type,
    });
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (formData.payoutMethod === 'UPI' && !formData.upiId) {
        showToast('Please enter UPI ID', 'error');
        return;
      }
      if (
        formData.payoutMethod === 'BANK' &&
        (!formData.bankAccountNumber ||
          !formData.bankIfscCode ||
          !formData.beneficiaryName)
      ) {
        showToast('Please fill all the fields', 'error');
        return;
      }
      const newMethod = {
        id: uuid.v4(),
        methodName: formData.payoutMethod,
        ...(formData.payoutMethod === 'UPI' && {upiId: formData.upiId}),
        ...(formData.payoutMethod === 'BANK' && {
          bankAccountNumber: formData.bankAccountNumber,
          bankIfscCode: formData.bankIfscCode,
          beneficiaryName: formData.beneficiaryName,
        }),
        isArchived: false,
      };

      const updatedData = {
        id: referrals.id,
        payoutMethods: [...referrals.payoutMethods, newMethod],
      };

      await updateReferralData(updatedData);
      dispatch(fetchReferralByInfluencerId(onBoarding?.id));
      showToast('Payout method added successfully', 'success');
      navigation.goBack();
      // navigation.navigate('WithdrawEarning');
    } catch (error) {
      console.log('error', error);

      showToast('Error occured', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <TopNav />
      <ScrollView className="flex-1 bg-white p-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-600 text-base mb-4">{'< Back'}</Text>
        </TouchableOpacity>
        <Text className="text-[22px] font-bold mb-4">Add Payout Method</Text>
        <Text className="text-base font-medium mb-2">Select Method</Text>
        <View className="flex-row gap-4 mb-6">
          {methods.map(method => (
            <TouchableOpacity
              key={method.id}
              onPress={() =>
                setFormData({...formData, payoutMethod: method.name})
              }
              className={`border p-3 rounded-xl ${
                formData.payoutMethod === method.name
                  ? 'border-blue-600'
                  : 'border-gray-300'
              }`}>
              {/* {<Image source={method.image} style={{width: 50, height: 40}} />} */}
              <method.image height={40} width={50} />
            </TouchableOpacity>
          ))}
        </View>

        {formData.payoutMethod === 'UPI' && (
          // <View className="mb-4">
          <>
            <Text className="mb-1 font-medium">Enter your UPI ID</Text>
            <TextInput
              placeholder="Enter UPI ID"
              value={formData.upiId}
              onChangeText={text => setFormData({...formData, upiId: text})}
              className="border border-gray-300 rounded-xl p-3"
            />
          </>
          // </View>
        )}
        {formData.payoutMethod === 'BANK' && (
          <>
            <View className="mb-4">
              <Text className="mb-1 font-medium">Account number</Text>
              <TextInput
                placeholder="Enter account number"
                value={formData.bankAccountNumber}
                onChangeText={text =>
                  setFormData({...formData, bankAccountNumber: text})
                }
                className="border border-gray-300 rounded-xl p-3 "
              />
            </View>
            <View className="mb-4">
              <Text className="mb-1 font-medium">IFSC Code</Text>
              <TextInput
                placeholder="Enter IFSC code"
                value={formData.bankIfscCode}
                onChangeText={text =>
                  setFormData({...formData, bankIfscCode: text})
                }
                className="border border-gray-300 rounded-xl p-3"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1 font-medium">Beneficiary Name</Text>

              <TextInput
                placeholder="Enter beneficiary name"
                value={formData.beneficiaryName}
                onChangeText={text =>
                  setFormData({...formData, beneficiaryName: text})
                }
                className="border border-gray-300 rounded-xl p-3"
              />
            </View>
          </>
        )}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          className="bg-blue-600 rounded-xl py-4 mt-4">
          <Text className="text-center text-white font-semibold text-base">
            {loading ? 'Saving...' : 'Confirm'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {toast?.toastDisplay && (
        <ToastMessage
          toastDisplay={toast.toastDisplay}
          toastMessage={toast.toastMessage}
          toastType={toast.toastType}
        />
      )}
    </SafeAreaView>
  );
};

export default AddPayoutMethod;

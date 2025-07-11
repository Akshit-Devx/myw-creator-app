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
import {
  createWithdrawalRequest,
  updateReferralData,
} from '../../../services/handleApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';
import {methods} from './payoutMethods';
import ToastMessage from '../../../components/Toast/Toast';
import DeleteModal from '../../../components/DeleteModal/DeleteModal';
import {fetchReferralByInfluencerId} from '../../../store/slices/referralSlice';

const EditPayoutMethod = ({navigation, route}) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    toastDisplay: '',
    toastMessage: '',
    toastType: '',
  });

  const params = route?.params;

  const {referrals} = useSelector(state => state.referral);
  const {onBoarding} = useSelector(state => state.onBoarding);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    payoutMethod: 'UPI',
    upiId: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    beneficiaryName: '',
  });

  useEffect(() => {
    const method = referrals.payoutMethods.find(
      method => method.id === params?.methodId,
    );
    setFormData({
      ...formData,
      payoutMethod: method?.methodName,
      upiId: method?.upiId,
      bankAccountNumber: method?.bankAccountNumber,
      bankIfscCode: method?.bankIfscCode,
      beneficiaryName: method?.beneficiaryName,
    });
  }, []);

  console.log('referrals nat withdraw ::: ', referrals);

  const handlePress = () => navigation.goBack();

  const IconComponent = Icons[formData?.payoutMethod];

  const showToast = (message, type) => {
    setToast({
      toastDisplay: Date.now().toString(),
      toastMessage: message,
      toastType: type,
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
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

      const updateMethod = {
        id: params?.methodId,
        methodName: formData.payoutMethod,
        ...(formData.payoutMethod === 'UPI' && {upiId: formData.upiId}),
        ...(formData.payoutMethod === 'BANK' && {
          bankAccountNumber: formData.bankAccountNumber,
          bankIfscCode: formData.bankIfscCode,
          beneficiaryName: formData.beneficiaryName,
        }),
        isArchived: false,
      };

      const existingMethodIndex = referrals.payoutMethods.findIndex(
        method => method.id === params?.methodId,
      );

      let updatedPayoutMethods;
      if (existingMethodIndex !== -1) {
        updatedPayoutMethods = [...referrals.payoutMethods];
        updatedPayoutMethods[existingMethodIndex] = updateMethod;
      } else {
        updatedPayoutMethods = [...referrals.payoutMethods, updateMethod];
      }

      const payload = {
        id: referrals.id,
        payoutMethods: updatedPayoutMethods,
      };

      await updateReferralData(payload);
      dispatch(fetchReferralByInfluencerId(onBoarding?.id));
      navigation.goBack();
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const updateMethod = {
        id: params?.methodId,
        methodName: formData.payoutMethod,
        ...(formData.payoutMethod === 'UPI' && {upiId: formData.upiId}),
        ...(formData.payoutMethod === 'BANK' && {
          bankAccountNumber: formData.bankAccountNumber,
          bankIfscCode: formData.bankIfscCode,
          beneficiaryName: formData.beneficiaryName,
        }),
        isArchived: true,
      };
      const existingMethodIndex = referrals.payoutMethods.findIndex(
        method => method.id === params?.methodId,
      );

      let updatedPayoutMethods;
      if (existingMethodIndex !== -1) {
        updatedPayoutMethods = [...referrals.payoutMethods];
        updatedPayoutMethods[existingMethodIndex] = updateMethod;
      } else {
        updatedPayoutMethods = [...referrals.payoutMethods, updateMethod];
      }

      const payload = {
        id: referrals.id,
        payoutMethods: updatedPayoutMethods,
      };

      await updateReferralData(payload);
      setShowConfirmationModal(false);
      dispatch(fetchReferralByInfluencerId(onBoarding?.id));
      navigation.goBack();
    } catch (error) {
      console.log('Error:', error);
    }
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
        <Text className="text-[28px] font-semibold">Edit Payout Method</Text>
        <Text className="text-[16px] font-bold  text-black mb-2 mt-5">
          Provider
        </Text>

        <View className="flex-row">
          <View className="border-2 rounded-[8px] border-[#406AFF] p-2">
            <IconComponent height={40} width={40} />
          </View>
        </View>
        {formData.payoutMethod === 'UPI' && (
          <>
            <Text className="text-base font-semibold text-black m-2">
              Enter your UPI ID
            </Text>

            {/* Input for amount */}
            <TextInput
              className=" font-medium text-black border border-gray-300 rounded-xl p-4 mb-4"
              placeholder="Enter UPI ID"
              placeholderTextColor="gray"
              onChangeText={e => {
                setFormData({...formData, upiId: e});
              }}
              value={formData.upiId}
            />
          </>
        )}

        {formData.payoutMethod === 'BANK' && (
          <>
            <Text className="text-base font-semibold text-black m-2 ">
              Account number
            </Text>

            {/* Input for bankAccountNumber */}
            <TextInput
              className=" font-medium text-black border border-gray-300 rounded-xl p-4 mb-4"
              placeholder="Enter account number"
              placeholderTextColor="gray"
              onChangeText={e => {
                setFormData({...formData, bankAccountNumber: e});
              }}
              value={formData.bankAccountNumber}
            />

            <Text className="text-base font-semibold text-black m-2">
              IFSC Code
            </Text>

            {/* Input for IFSC */}
            <TextInput
              className=" font-mediuxxm text-black border border-gray-300 rounded-xl p-4 mb-4"
              placeholder="Enter IFSC code"
              placeholderTextColor="gray"
              onChangeText={e => {
                setFormData({...formData, bankIfscCode: e});
              }}
              value={formData.bankIfscCode}
            />

            <Text className="text-base font-semibold text-black m-2">
              Beneficiary Name
            </Text>

            {/* Input for Beneficiary Name */}
            <TextInput
              className=" font-mediuxxm text-black border border-gray-300 rounded-xl p-4 mb-4"
              placeholder="Enter beneficiary name"
              placeholderTextColor="gray"
              onChangeText={e => {
                setFormData({...formData, beneficiaryName: e});
              }}
              value={formData.beneficiaryName}
            />
          </>
        )}

        <Button
          title={'Remove'}
          variant="secondary"
          onPress={() => {
            setShowConfirmationModal(true);
          }}
          className="rounded-xl border-red-500 h-12"
          textClassName="text-red-500 text-lg"
        />
        <Button
          title={'Confirm'}
          variant="primary"
          onPress={handleConfirm}
          className="rounded-xl border-gray-200 h-12 mt-6"
          textClassName="text-blue-600 text-lg"
        />
      </View>
      {showConfirmationModal && (
        <DeleteModal
          visible={showConfirmationModal}
          text="payout method"
          closeModal={setShowConfirmationModal}
          deleteConfirmation={handleDelete}
        />
      )}

      {toast.toastDisplay && (
        <ToastMessage
          toastDisplay={toast.toastDisplay}
          toastMessage={toast.toastMessage}
          toastType={toast.toastType}
        />
      )}
    </SafeAreaView>
  );
};

export default EditPayoutMethod;

const styles = StyleSheet.create({});

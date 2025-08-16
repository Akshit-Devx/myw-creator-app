import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Text, TouchableOpacity, View} from 'react-native';
import Button from '../../../../../../components/elements/Button';
import InputField from '../../../../../../components/elements/Input';
import {updateReferralTrackingAPI} from '../../../../../../services/handleApi';
import {PAYOUT_METHOD} from '../../../../../../utility/common';
import {generateUUIDv4} from '../../../../../../utility/helper';
import DetailStackHeader from '../../../../../../components/common/DetailStackHeader';

const PayoutMethodScreen = () => {
  const route = useRoute();
  const {referralData, mode, selectedPayoutMethod} = route?.params || {};
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState(PAYOUT_METHOD[0]);
  const [btnLoading, setBtnLoading] = useState(null);

  const {
    control,
    setValue,
    handleSubmit,
    clearErrors,
    formState: {errors},
  } = useForm({
    defaultValues: {
      upiId: '',
      bankAccountNumber: '',
      bankIfscCode: '',
      beneficiaryName: '',
    },
  });

  useEffect(() => {
    if (mode === 'EDIT' && selectedPayoutMethod) {
      const methodName = selectedPayoutMethod.methodName;
      setSelectedMethod(methodName);

      if (methodName === 'UPI') {
        setValue('upiId', selectedPayoutMethod.upiId);
      } else if (methodName === 'BANK') {
        setValue('bankAccountNumber', selectedPayoutMethod.bankAccountNumber);
        setValue('bankIfscCode', selectedPayoutMethod.bankIfscCode);
        setValue('beneficiaryName', selectedPayoutMethod.beneficiaryName);
      }
    }
  }, [mode, selectedPayoutMethod, setValue]);

  const onAddSubmit = async data => {
    setBtnLoading('ADD');
    try {
      const newMethod = {
        id: generateUUIDv4(),
        methodName: selectedMethod,
        ...(selectedMethod === 'UPI' && {upiId: data.upiId}),
        ...(selectedMethod === 'BANK' && {
          bankAccountNumber: data.bankAccountNumber,
          bankIfscCode: data.bankIfscCode,
          beneficiaryName: data.beneficiaryName,
        }),
        isArchived: false,
      };

      const payload = {
        id: referralData.id,
        payoutMethods: [...referralData.payoutMethods, newMethod],
      };

      const response = await updateReferralTrackingAPI(payload);

      if (response) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBtnLoading(null);
    }
  };

  const onEditSubmit = async data => {
    setBtnLoading('EDIT');
    try {
      const newMethod = {
        id: selectedPayoutMethod.id,
        methodName: selectedMethod,
        ...(selectedMethod === 'UPI' && {upiId: data.upiId}),
        ...(selectedMethod === 'BANK' && {
          bankAccountNumber: data.bankAccountNumber,
          bankIfscCode: data.bankIfscCode,
          beneficiaryName: data.beneficiaryName,
        }),
        isArchived: false,
      };

      const payload = {
        id: referralData.id,
        payoutMethods: referralData.payoutMethods.map(item => {
          if (item.id === selectedPayoutMethod.id) {
            return newMethod;
          }
          return item;
        }),
      };

      const response = await updateReferralTrackingAPI(payload);

      if (response) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBtnLoading(null);
    }
  };

  const onDeleteSubmit = async () => {
    setBtnLoading('DELETE');
    try {
      const payload = {
        id: referralData.id,
        payoutMethods: referralData.payoutMethods.map(item => {
          if (item.id === selectedPayoutMethod.id) {
            return {...item, isArchived: true};
          }
          return item;
        }),
      };

      const response = await updateReferralTrackingAPI(payload);

      if (response) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setBtnLoading(null);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Payout Method"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <View className="flex-1 flex-col gap-4 bg-white p-5">
        {mode === 'ADD' && (
          <>
            <Text className="text-lg font-semibold">Select Method</Text>
            <View className="flex-row gap-2">
              {PAYOUT_METHOD.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedMethod(item)}
                  className={`  p-2 border  rounded-md ${
                    selectedMethod === item
                      ? 'border-blue-600'
                      : 'border-gray-200'
                  }`}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {selectedMethod === 'UPI' && (
          <Controller
            control={control}
            name="upiId"
            rules={{
              required: 'UPI ID is required',
              pattern: {
                value: /^[\w.-]+@[\w.-]+$/,
                message: 'Enter a valid UPI ID',
              },
            }}
            render={({field: {onChange, value}}) => (
              <InputField
                label="UPI ID"
                placeholder="Enter UPI ID"
                value={value}
                onChangeText={text => {
                  clearErrors('upiId');
                  onChange(text);
                }}
                error={errors.upiId?.message}
              />
            )}
          />
        )}

        {selectedMethod === 'BANK' && (
          <>
            <Controller
              control={control}
              name="bankAccountNumber"
              rules={{required: 'Account Number is required'}}
              render={({field: {onChange, value}}) => (
                <InputField
                  label="Account Number"
                  placeholder="Enter Account Number"
                  value={value}
                  onChangeText={text => {
                    clearErrors('bankAccountNumber');
                    onChange(text);
                  }}
                  error={errors.bankAccountNumber?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="bankIfscCode"
              rules={{
                required: 'IFSC Code is required',
                pattern: {
                  value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                  message: 'Enter a valid IFSC Code',
                },
              }}
              render={({field: {onChange, value}}) => (
                <InputField
                  label="IFSC Code"
                  placeholder="Enter IFSC Code"
                  value={value}
                  onChangeText={text => {
                    clearErrors('bankIfscCode');
                    onChange(text);
                  }}
                  error={errors.bankIfscCode?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="beneficiaryName"
              rules={{required: 'Beneficiary Name is required'}}
              render={({field: {onChange, value}}) => (
                <InputField
                  label="Beneficiary Name"
                  placeholder="Enter Beneficiary Name"
                  value={value}
                  onChangeText={text => {
                    clearErrors('beneficiaryName');
                    onChange(text);
                  }}
                  error={errors.beneficiaryName?.message}
                />
              )}
            />
          </>
        )}

        {mode === 'EDIT' && (
          <Button
            variant="secondary"
            title="Delete"
            onPress={onDeleteSubmit}
            className="border-red-500"
            loading={btnLoading === 'DELETE'}
            textClassName="text-red-500"
          />
        )}

        <Button
          title="Submit"
          onPress={handleSubmit(mode === 'ADD' ? onAddSubmit : onEditSubmit)}
          loading={btnLoading === 'ADD' || btnLoading === 'EDIT'}
        />
      </View>
    </View>
  );
};

export default PayoutMethodScreen;

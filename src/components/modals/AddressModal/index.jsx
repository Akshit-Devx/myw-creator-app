import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Modal, Text, View} from 'react-native';
import Button from '../../../components/elements/Button';
import InputField from '../../../components/elements/Input';
import {fetchLocationByPincodeAPI} from '../../../services/externalApi';

const AddressModal = ({
  visible,
  onClose,
  onSave,
  initialData = null,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      addressLine1: initialData?.addressLine1 || '',
      addressLine2: initialData?.addressLine2 || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || '',
      pincode: initialData?.pincode || '',
    },
  });

  const pincode = watch('pincode');

  useEffect(() => {
    const fetchLocation = async () => {
      if (pincode && pincode.length === 6 && /^[0-9]{6}$/.test(pincode)) {
        const location = await fetchLocationByPincodeAPI(pincode);
        if (location) {
          setValue('city', location.city);
          setValue('state', location.state);
          setValue('country', location.country);
        }
      }
    };
    fetchLocation();
  }, [pincode]);

  useEffect(() => {
    if (visible) {
      reset({
        addressLine1: initialData?.addressLine1 || '',
        addressLine2: initialData?.addressLine2 || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        country: initialData?.country || '',
        pincode: initialData?.pincode || '',
      });
    }
  }, [initialData, visible]);

  const onSubmit = data => {
    onSave({
      addressLine1: data.addressLine1.trim(),
      addressLine2: data.addressLine2.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      country: data.country.trim(),
      pincode: data.pincode.trim(),
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl p-5 w-11/12 max-w-md">
          <Text className="text-xl font-medium mb-4">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </Text>
          <View className="flex-col gap-2">
            <Controller
              control={control}
              name="addressLine1"
              rules={{required: 'Address Line 1 is required'}}
              render={({field: {onChange, value}}) => (
                <InputField
                  label="Flat,House no., Building, Company,Apartment"
                  value={value}
                  onChangeText={text => {
                    clearErrors('addressLine1');
                    onChange(text);
                  }}
                  error={errors.addressLine1?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="addressLine2"
              render={({field: {onChange, value}}) => (
                <InputField
                  label="Area, Street, Sector, Village"
                  value={value}
                  onChangeText={text => {
                    clearErrors('addressLine2');
                    onChange(text);
                  }}
                  error={errors.addressLine2?.message}
                />
              )}
            />
            <View className="flex-row gap-4">
              <Controller
                control={control}
                name="pincode"
                rules={{
                  required: 'Pincode is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Pincode must be 6 digits',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <InputField
                    label="Pincode"
                    value={value}
                    onChangeText={text => {
                      if (/^\d*$/.test(text)) {
                        clearErrors('pincode');
                        onChange(text);
                      }
                    }}
                    error={errors.pincode?.message}
                    keyboardType="numeric"
                    containerClassName="w-[48%]"
                  />
                )}
              />
              <Controller
                control={control}
                name="city"
                render={({field: {value}}) => (
                  <InputField
                    label="City"
                    value={value}
                    disabled
                    containerClassName="w-[48%]"
                  />
                )}
              />
            </View>
            <View className="flex-row gap-4">
              <Controller
                control={control}
                name="state"
                render={({field: {value}}) => (
                  <InputField
                    label="State"
                    value={value}
                    disabled
                    containerClassName="w-[48%]"
                  />
                )}
              />
              <Controller
                control={control}
                name="country"
                render={({field: {value}}) => (
                  <InputField
                    label="Country"
                    value={value}
                    disabled
                    containerClassName="w-[48%]"
                  />
                )}
              />
            </View>
          </View>

          <View className="flex-row justify-between gap-2 mt-4">
            <Button
              title="Cancel"
              className="w-[48%]"
              variant="secondary"
              onPress={onClose}
            />
            <Button
              title={initialData ? 'Update' : 'Save'}
              className="w-[48%]"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressModal;
